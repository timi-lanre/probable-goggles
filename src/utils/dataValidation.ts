
import { supabase } from '@/integrations/supabase/client';

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FavoriteAdvisor {
  id: string;
  advisor_id: string;
  advisors: any;
}

/**
 * Validates favorite advisor data for missing or invalid records
 */
export function validateFavoriteAdvisors(favoriteAdvisors: FavoriteAdvisor[]): DataValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for missing advisor data
  const missingAdvisors = favoriteAdvisors.filter(item => !item.advisors);
  if (missingAdvisors.length > 0) {
    warnings.push(`${missingAdvisors.length} favorite items reference advisors that no longer exist`);
  }
  
  // Check for incomplete advisor data
  const incompleteAdvisors = favoriteAdvisors.filter(item => 
    item.advisors && (!item.advisors.first_name && !item.advisors.last_name)
  );
  if (incompleteAdvisors.length > 0) {
    warnings.push(`${incompleteAdvisors.length} advisors have incomplete name information`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Cleans up orphaned favorite list items that reference deleted advisors
 */
export async function cleanupOrphanedFavorites(listId: string): Promise<void> {
  try {
    // Get all favorite items for this list with their advisor data
    const { data: favoriteItems, error: fetchError } = await supabase
      .from('favorite_list_items')
      .select(`
        id,
        advisor_id,
        advisors (id)
      `)
      .eq('favorite_list_id', listId);

    if (fetchError) {
      console.error('Error fetching favorite items for cleanup:', fetchError);
      return;
    }

    if (!favoriteItems) return;

    // Find items with missing advisor references
    const orphanedItems = favoriteItems.filter(item => !item.advisors);
    
    if (orphanedItems.length > 0) {
      console.warn(`Found ${orphanedItems.length} orphaned favorite items, cleaning up...`);
      
      const orphanedIds = orphanedItems.map(item => item.id);
      
      const { error: deleteError } = await supabase
        .from('favorite_list_items')
        .delete()
        .in('id', orphanedIds);
      
      if (deleteError) {
        console.error('Error cleaning up orphaned favorites:', deleteError);
      } else {
        console.log(`Successfully cleaned up ${orphanedItems.length} orphaned favorite items`);
      }
    }
  } catch (error) {
    console.error('Error during favorite cleanup:', error);
  }
}

/**
 * Validates report advisor IDs to ensure they still exist
 */
export async function validateReportAdvisors(advisorIds: string[]): Promise<DataValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    if (advisorIds.length === 0) {
      return { isValid: true, errors, warnings };
    }
    
    // Check which advisor IDs actually exist
    const { data: existingAdvisors, error } = await supabase
      .from('advisors')
      .select('id')
      .in('id', advisorIds);
    
    if (error) {
      errors.push('Failed to validate advisor references');
      return { isValid: false, errors, warnings };
    }
    
    const existingIds = new Set(existingAdvisors?.map(a => a.id) || []);
    const missingIds = advisorIds.filter(id => !existingIds.has(id));
    
    if (missingIds.length > 0) {
      warnings.push(`${missingIds.length} advisors in this report no longer exist`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  } catch (error) {
    console.error('Error validating report advisors:', error);
    errors.push('Failed to validate advisor references');
    return { isValid: false, errors, warnings };
  }
}

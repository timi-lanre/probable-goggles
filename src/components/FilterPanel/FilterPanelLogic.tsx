import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SelectedFilters } from './FilterPanelTypes';

interface UseFilterPanelLogicProps {
  selectedFilters: SelectedFilters;
  onApplyFilters: (filters: SelectedFilters) => void;
  onSaveAsReport?: (name: string, description: string, filters: SelectedFilters, advisorIds: string[]) => void;
  currentAdvisorIds?: string[];
}

export function useFilterPanelLogic({
  selectedFilters,
  onApplyFilters,
  onSaveAsReport,
  currentAdvisorIds = []
}: UseFilterPanelLogicProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);
  const [localFilters, setLocalFilters] = useState<SelectedFilters>(selectedFilters);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFilterChange = (category: keyof SelectedFilters, value: string) => {
    setLocalFilters(prev => {
      const newFilters = {
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      };

      // Don't clear dependent filters - let cascading happen naturally through the UI
      return newFilters;
    });
  };

  const handleRemoveFilter = (category: keyof SelectedFilters, value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== value)
    }));
  };

  const handleClearCategory = (category: keyof SelectedFilters) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: []
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      provinces: [],
      cities: [],
      firms: [],
      branches: [],
      teams: [],
      favoriteLists: [],
      reports: []
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleSaveAsReport = () => {
    setShowSaveDialog(true);
  };

  const handleSaveReport = async (name: string, description: string) => {
    if (!onSaveAsReport) return;
    
    setIsSaving(true);
    try {
      await onSaveAsReport(name, description, selectedFilters, currentAdvisorIds);
      setShowSaveDialog(false);
      toast({
        title: "Report Saved",
        description: `Report "${name}" has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(filters => filters.length > 0);
  const hasUnappliedChanges = JSON.stringify(localFilters) !== JSON.stringify(selectedFilters);
  const activeFilterCount = Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0);

  return {
    isExpanded,
    setIsExpanded,
    localFilters,
    showSaveDialog,
    setShowSaveDialog,
    isSaving,
    hasActiveFilters,
    hasUnappliedChanges,
    activeFilterCount,
    handleFilterChange,
    handleRemoveFilter,
    handleClearCategory,
    handleApplyFilters,
    handleClearFilters,
    handleSaveAsReport,
    handleSaveReport
  };
}



export const applySortWithNullHandling = (query: any, sortField: string, sortDirection: 'asc' | 'desc') => {
  console.log(`🔧 Applying sort: ${sortField} ${sortDirection}`);
  
  // With cleaned data (empty strings converted to NULLs), we can use consistent logic
  // For ascending: A-Z then NULLs (nulls last)
  // For descending: NULLs then Z-A (nulls first)
  const result = query.order(sortField, { 
    ascending: sortDirection === 'asc',
    nullsFirst: sortDirection === 'desc'
  });
  
  console.log(`✅ Sort applied with nullsFirst: ${sortDirection === 'desc'}`);
  return result;
};

// Helper function for debugging - let's see what data we're actually getting
export const logSortingData = (data: any[], field: string, direction: 'asc' | 'desc') => {
  console.log(`📊 Sorting debug for ${field} ${direction}:`);
  console.log('First 10 values:', data.slice(0, 10).map(item => ({
    id: item.id,
    [field]: item[field],
    isNull: item[field] === null || item[field] === undefined
  })));
  
  const nullCount = data.filter(item => item[field] === null || item[field] === undefined).length;
  const nonNullCount = data.length - nullCount;
  console.log(`📈 Data distribution: ${nonNullCount} non-null, ${nullCount} null`);
};


/**
 * Check if a value is missing or empty
 */
export const isMissing = (value) => {
  return !value || value === 'MISSING' || value === '' || value === null || value === undefined;
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `$${amount.toFixed(2)}`;
};

/**
 * Format date
 */
export const formatDate = (dateString) => {
  if (isMissing(dateString)) return 'MISSING';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

/**
 * Validate file type
 */
export const validateFileType = (file) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];
  
  const allowedExtensions = ['.xlsx', '.xls', '.pdf', '.png', '.jpg', '.jpeg'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'));
};

/**
 * Calculate totals
 */
export const calculateTotals = (invoices) => {
  return {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
    totalTax: invoices.reduce((sum, inv) => sum + (inv.tax || 0), 0),
  };
};
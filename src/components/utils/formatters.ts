// Indian localization utilities

/**
 * Format an amount into Indian Rupee format (e.g., ₹1,25,000 or ₹45,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));
  
  // Use Indian numbering formatting
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formattedNumber}`;
}

/**
 * Format a date string (YYYY-MM-DD) to Indian format (DD/MM/YYYY or DD Mon YYYY)
 */
export function formatIndianDate(dateString: string, style: 'numeric' | 'short' | 'long' = 'short'): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;

    if (style === 'numeric') {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    if (style === 'long') {
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }

    // Default short format e.g. "15 Jan 2025"
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format time in IST format (e.g. 09:30 AM IST)
 */
export function formatISTTime(date: Date = new Date()): string {
  return (
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }) + ' IST'
  );
}

/**
 * Common Indian States and Union Territories
 */
export const INDIAN_STATES_AND_UT = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Chandigarh',
  'Jammu & Kashmir',
  'Ladakh',
  'Puducherry',
];

/**
 * Prominent Indian Tech & Business Locations
 */
export const INDIAN_OFFICE_LOCATIONS = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Gurugram, Haryana',
  'Noida, Uttar Pradesh',
  'Chennai, Tamil Nadu',
  'Ahmedabad, Gujarat',
  'Kochi, Kerala',
  'Kolkata, West Bengal',
  'Jaipur, Rajasthan',
  'Chandigarh',
];

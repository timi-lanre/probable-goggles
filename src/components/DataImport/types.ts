
export interface ParsedData {
  headers: string[];
  rows: string[][];
}

export interface DuplicateCheck {
  rowIndex: number;
  existingAdvisor: any;
  matchedFields: string[];
}

export const EXPECTED_COLUMNS = [
  'first_name', 'last_name', 'team_name', 'title', 'firm', 
  'branch', 'city', 'province', 'email', 'linkedin_url', 'website_url',
  'address', 'postal_code', 'business_phone', 'mobile_phone'
];

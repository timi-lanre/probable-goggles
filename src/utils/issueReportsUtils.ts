
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const columnLabels: { [key: string]: string } = {
  first_name: 'First Name',
  last_name: 'Last Name',
  title: 'Title',
  firm: 'Firm',
  branch: 'Branch',
  team_name: 'Team Name',
  city: 'City',
  province: 'Province',
  email: 'Email',
  linkedin_url: 'LinkedIn URL',
  website_url: 'Website URL',
  address: 'Address',
  postal_code: 'Postal Code',
  business_phone: 'Business Phone',
  mobile_phone: 'Mobile Phone',
};

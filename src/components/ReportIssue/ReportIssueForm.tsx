
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ReportFormData {
  columnName: string;
  issueDescription: string;
}

interface ReportIssueFormProps {
  onSubmit: (data: ReportFormData) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const columnOptions = [
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'title', label: 'Title' },
  { value: 'firm', label: 'Firm' },
  { value: 'branch', label: 'Branch' },
  { value: 'team_name', label: 'Team Name' },
  { value: 'city', label: 'City' },
  { value: 'province', label: 'Province' },
  { value: 'email', label: 'Email' },
  { value: 'linkedin_url', label: 'LinkedIn URL' },
  { value: 'website_url', label: 'Website URL' },
  { value: 'address', label: 'Address' },
  { value: 'postal_code', label: 'Postal Code' },
  { value: 'business_phone', label: 'Business Phone' },
  { value: 'mobile_phone', label: 'Mobile Phone' },
];

export function ReportIssueForm({ onSubmit, isSubmitting, onCancel }: ReportIssueFormProps) {
  const form = useForm<ReportFormData>({
    defaultValues: {
      columnName: '',
      issueDescription: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="columnName"
          rules={{ required: "Please select a column" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Which column has an issue?</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {columnOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issueDescription"
          rules={{ 
            required: "Please describe the issue",
            minLength: { value: 10, message: "Please provide more details (at least 10 characters)" }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's wrong?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

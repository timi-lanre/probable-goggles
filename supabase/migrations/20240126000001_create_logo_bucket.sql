
-- Create a public bucket for logos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'logos', 
  'logos', 
  true, 
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- Create policy to allow public read access
create policy "Public Access" on storage.objects for select using (bucket_id = 'logos');

-- Create policy to allow authenticated users to upload
create policy "Authenticated users can upload logos" on storage.objects for insert with check (bucket_id = 'logos' and auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update logos
create policy "Authenticated users can update logos" on storage.objects for update using (bucket_id = 'logos' and auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete logos
create policy "Authenticated users can delete logos" on storage.objects for delete using (bucket_id = 'logos' and auth.role() = 'authenticated');

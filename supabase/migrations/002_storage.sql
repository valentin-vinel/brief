-- 002_storage.sql
-- Policies Storage pour le bucket folder-images

-- Un user peut uploader dans son propre dossier (chemin : user_id/*)
create policy "users can upload own folder images"
  on storage.objects for insert
  with check (
    bucket_id = 'folder-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Un user peut mettre à jour ses propres images
create policy "users can update own folder images"
  on storage.objects for update
  using (
    bucket_id = 'folder-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Un user peut supprimer ses propres images
create policy "users can delete own folder images"
  on storage.objects for delete
  using (
    bucket_id = 'folder-images' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Lecture publique (bucket public donc nécessaire)
create policy "public can read folder images"
  on storage.objects for select
  using (bucket_id = 'folder-images');
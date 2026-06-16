-- 003_grants.sql
-- 001_init.sql active RLS sur folders/summaries mais ne donne jamais les
-- privilèges de table au rôle authenticated. RLS restreint les lignes
-- visibles, mais Postgres exige aussi un GRANT au niveau table — sans ça,
-- toute requête authentifiée échoue avec "permission denied for table".

grant select, insert, update, delete on public.folders to authenticated;
grant select, insert, update, delete on public.summaries to authenticated;

-- OPPOSITE.EXE mission control: run once in supabase dashboard > SQL editor.
-- presence + broadcast need NO tables (fully ephemeral, nothing stored).
-- the policy below only matters if you enable RLS enforcement on realtime;
-- with default settings public broadcast/presence just works with the anon key.
-- channels used by the app:
--   visitors (presence):  { id, name, joinedAt, lastActive }
--   orders   (broadcast, event "command"): { to, gag, arg }
--   spy      (broadcast, event "spy"):     { from, text, at }
drop policy if exists "open gag channels" on realtime.messages;
create policy "open gag channels" on realtime.messages
  for all to anon using (true) with check (true);

# mission control runbook (opposite.exe prank console)
local admin panel: type `letmein` anywhere, or click the logo 5 times in 3 seconds.
first correct entry has a 30% denial roulette. refresh locks it again. nothing is stored.
remote mission control needs two vercel env vars (all environments):
- NEXT_PUBLIC_SUPABASE_URL (project api url)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (publishable key only, never the secret key)
without them the panel shows "mission control: offline (no supabase keys)" and everything else still works.
no tables, no sql, no rls needed. presence + broadcast channels only: visitors, orders, spy.
visitors get codenames, heartbeat every 15s, vanish 30s after closing the tab.
admin: pick a target (this screen / everyone / one victim), fire gags, toast, speak, watch the spy feed.
support inbox: visitor messages arrive live, target a message, reply as support.
god toggles: hold still (freeze dodging), silence (stop toasts + roasts), skip the terms, pacifist (all gags off).
chaos button fires 5 random gags. every action has a 20% judgment toast. obviously.
--- group therapy update ---
fake support is now a REAL public chat (supabase broadcast channel "room").
your codename is your chat name. 200 chars max, 1 message per second, last 30 kept.
join/leave lines appear automatically, header shows live victim count, html renders as plain text.
the send button sometimes chickens out (10%) but messages always send. probably.
admin sees the room feed in mission control, posts as "opposite.exe support team",
can shadowban names (local hide only). nothing is stored anywhere. obviously.

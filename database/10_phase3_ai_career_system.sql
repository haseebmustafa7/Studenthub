-- Phase 3 AI Career Intelligence persistence layer. Non-destructive: creates only new tables/indexes.
create table if not exists career_twins (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, data jsonb not null default '{}', created_at timestamptz default now(), updated_at timestamptz default now(), unique(user_id));
create table if not exists career_readiness_scores (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, career_id uuid references careers(id) on delete set null, overall_score numeric(5,2) not null default 0, data jsonb not null default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists job_match_explanations (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, job_id uuid not null references jobs(id) on delete cascade, score numeric(5,2) not null default 0, data jsonb not null default '{}', created_at timestamptz default now(), updated_at timestamptz default now(), unique(user_id,job_id));
create table if not exists job_skill_gaps (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, job_id uuid not null references jobs(id) on delete cascade, data jsonb not null default '{}', created_at timestamptz default now(), updated_at timestamptz default now(), unique(user_id,job_id));
create table if not exists application_copilot_drafts (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, job_id uuid references jobs(id) on delete set null, data jsonb not null default '{}', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists interview_sessions (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, job_id uuid references jobs(id) on delete set null, role_title text, turns jsonb not null default '[]', status text not null default 'active', created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists career_what_if_runs (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, scenario text not null, data jsonb not null default '{}', created_at timestamptz default now());
create table if not exists opportunity_radar_snapshots (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, data jsonb not null default '{}', created_at timestamptz default now());
create table if not exists career_journeys (id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users(id) on delete cascade, data jsonb not null default '{}', created_at timestamptz default now(), updated_at timestamptz default now(), unique(user_id));
create index if not exists idx_readiness_user on career_readiness_scores(user_id, created_at desc);
create index if not exists idx_match_explanations_user on job_match_explanations(user_id);
create index if not exists idx_job_skill_gaps_user on job_skill_gaps(user_id);
create index if not exists idx_interview_sessions_user on interview_sessions(user_id, created_at desc);
create index if not exists idx_radar_user on opportunity_radar_snapshots(user_id, created_at desc);

alter table career_twins enable row level security;
alter table career_readiness_scores enable row level security;
alter table job_match_explanations enable row level security;
alter table job_skill_gaps enable row level security;
alter table application_copilot_drafts enable row level security;
alter table interview_sessions enable row level security;
alter table career_what_if_runs enable row level security;
alter table opportunity_radar_snapshots enable row level security;
alter table career_journeys enable row level security;

create policy "users manage own career twins" on career_twins for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own readiness" on career_readiness_scores for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own job match explanations" on job_match_explanations for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own skill gaps" on job_skill_gaps for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own copilot drafts" on application_copilot_drafts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own interview sessions" on interview_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own what if runs" on career_what_if_runs for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own radar" on opportunity_radar_snapshots for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own journeys" on career_journeys for all using (user_id = auth.uid()) with check (user_id = auth.uid());

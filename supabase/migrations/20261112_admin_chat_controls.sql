-- Add the conversation fields required by admin chat review and closure.
-- Run this once in Supabase SQL Editor on projects created from an older schema.

alter table meeting_requests
  add column if not exists meeting_format text default 'chat';

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  meeting_request_id uuid references meeting_requests(id) on delete cascade,
  volunteer_id uuid references volunteers(id),
  seeker_name text,
  seeker_email text,
  meeting_format text default 'chat',
  seeker_token text unique not null,
  status text default 'Active',
  closed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  sender_type text not null,
  sender_name text,
  content text not null,
  proposed_call_time text,
  created_at timestamptz default now()
);

alter table chats enable row level security;
alter table chat_messages enable row level security;

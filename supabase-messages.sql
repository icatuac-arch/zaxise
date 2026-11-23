-- Agent messages table for inter-agent communication (Gundya <-> Claud)
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_agent TEXT NOT NULL,
  to_agent TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  thread_id UUID REFERENCES agent_messages(id),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_to ON agent_messages (to_agent, read_at, created_at DESC);
CREATE INDEX idx_messages_thread ON agent_messages (thread_id, created_at);

ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_service_only" ON agent_messages FOR ALL TO service_role USING (true);

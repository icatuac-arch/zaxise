'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, Check, X, Eye, Lock } from 'lucide-react';

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  topic: string;
  comment: string;
  status: string;
  created_at: string;
}

export default function AdminCommentsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;
    if (!adminKey) {
      alert('Admin key not configured. Set NEXT_PUBLIC_ADMIN_KEY in .env.local');
      return;
    }
    if (password === adminKey) {
      setAuthenticated(true);
    } else {
      alert('Invalid admin key');
    }
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/rent-or-buy/supabase/client');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('status', tab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (authenticated) fetchComments();
  }, [authenticated, tab, fetchComments]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { createClient } = await import('@/lib/rent-or-buy/supabase/client');
      const supabase = createClient();
      const { error } = await supabase
        .from('comments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error('Error updating comment:', err);
      alert('Failed to update comment');
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Admin Access</h1>
          <p className="text-sm text-muted mb-6">Enter the admin key to manage comments.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Key"
              className="w-full px-4 py-3 border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card text-center font-mono"
              autoFocus
            />
            <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-dark">Comment Moderation</h1>
          <p className="text-sm text-muted">Approve, reject, or remove community comments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-background rounded-xl p-1 mb-6 w-fit">
        {(['pending', 'approved', 'rejected'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-card text-primary shadow-sm' : 'text-muted hover:text-dark'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted">Loading...</div>
      ) : comments.length === 0 ? (
        <div className="bg-background rounded-2xl p-8 text-center text-muted">
          <p>No {tab} comments.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-card border border-card-border rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-dark">{c.author_name}</span>
                    <span className="text-xs text-muted">{c.author_email}</span>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">{c.topic}</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap mb-2">{c.comment}</p>
                  <div className="text-xs text-muted">
                    {new Date(c.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {tab === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(c.id, 'approved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button
                        onClick={() => updateStatus(c.id, 'rejected')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </>
                  )}
                  {tab === 'approved' && (
                    <button
                      onClick={() => updateStatus(c.id, 'rejected')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  )}
                  {tab === 'rejected' && (
                    <button
                      onClick={() => updateStatus(c.id, 'approved')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> Restore
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Trash2, Plus, PartyPopper, Calendar, MessageSquare } from 'lucide-react';
import AdBanner from '@/components/time/AdBanner';

interface TimeCapsule {
  id: string;
  message: string;
  createdAt: string;
  unlockAt: string;
}

export default function TimeCapsulePage() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [now, setNow] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [celebrateId, setCelebrateId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('dateandtimezone-time-capsules');
    if (stored) {
      setCapsules(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  function saveCapsules(updated: TimeCapsule[]) {
    setCapsules(updated);
    localStorage.setItem('dateandtimezone-time-capsules', JSON.stringify(updated));
  }

  function handleCreate() {
    if (!message.trim() || !unlockDate) return;
    const capsule: TimeCapsule = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      unlockAt: new Date(unlockDate).toISOString(),
    };
    saveCapsules([...capsules, capsule]);
    setMessage('');
    setUnlockDate('');
    setShowForm(false);
  }

  function handleDelete(id: string) {
    saveCapsules(capsules.filter(c => c.id !== id));
  }

  function isUnlocked(capsule: TimeCapsule): boolean {
    return now >= new Date(capsule.unlockAt);
  }

  function getCountdown(unlockAt: string): string {
    const diff = new Date(unlockAt).getTime() - now.getTime();
    if (diff <= 0) return 'Unlocked!';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }

  function handleUnlockReveal(id: string) {
    setCelebrateId(id);
    setTimeout(() => setCelebrateId(null), 4000);
  }

  const minDate = new Date(now.getTime() + 60000).toISOString().slice(0, 16);

  return (
    <main className="min-h-screen bg-dark-bg px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card-bg/40 border border-card-border px-4 py-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted">Time Capsule</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Time Capsule</h1>
          <p className="text-muted">Write a message to your future self. It stays locked until the date you choose.</p>
        </div>

        {/* Create Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 mx-auto flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-medium hover:bg-primary/80 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create New Time Capsule
          </button>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-card-border bg-card-bg/40 p-6 space-y-4">
            <h2 className="text-lg font-heading font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Write Your Message
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Dear future me..."
              className="w-full rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y"
            />
            <div>
              <label className="block text-sm text-muted mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Unlock Date & Time
              </label>
              <input
                type="datetime-local"
                value={unlockDate}
                min={minDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="rounded-lg border border-card-border bg-dark-bg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={!message.trim() || !unlockDate}
                className="rounded-xl bg-primary px-6 py-3 text-white font-medium hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Lock className="h-4 w-4 inline mr-2" />
                Seal Capsule
              </button>
              <button
                onClick={() => { setShowForm(false); setMessage(''); setUnlockDate(''); }}
                className="rounded-xl border border-card-border px-6 py-3 text-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Capsules List */}
        {capsules.length === 0 && !showForm && (
          <div className="text-center rounded-2xl border border-card-border bg-card-bg/40 p-12">
            <Lock className="h-12 w-12 text-muted/40 mx-auto mb-4" />
            <p className="text-muted">No time capsules yet. Create one to send a message to your future self!</p>
          </div>
        )}

        <div className="space-y-4">
          {capsules.map(capsule => {
            const unlocked = isUnlocked(capsule);
            const celebrating = celebrateId === capsule.id;

            return (
              <div
                key={capsule.id}
                className={`relative rounded-2xl border p-6 transition-all ${
                  unlocked
                    ? 'border-secondary/60 bg-card-bg/60'
                    : 'border-card-border bg-card-bg/40'
                } ${celebrating ? 'ring-2 ring-secondary animate-pulse' : ''}`}
              >
                {/* Celebration overlay */}
                {celebrating && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-dark-bg/80 z-10">
                    <div className="text-center animate-bounce">
                      <PartyPopper className="h-12 w-12 text-secondary mx-auto mb-2" />
                      <p className="text-xl font-heading font-bold text-white">Time Capsule Opened!</p>
                      <p className="text-sm text-muted mt-1">Your message from the past awaits below</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {unlocked ? (
                        <Unlock className="h-4 w-4 text-secondary" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted" />
                      )}
                      <span className={`text-sm font-medium ${unlocked ? 'text-secondary' : 'text-muted'}`}>
                        {unlocked ? 'Unlocked' : getCountdown(capsule.unlockAt)}
                      </span>
                    </div>

                    {unlocked ? (
                      <div>
                        <p className="text-white whitespace-pre-wrap">{capsule.message}</p>
                        <p className="text-xs text-muted mt-3">
                          Created {new Date(capsule.createdAt).toLocaleDateString()} &middot; Unlocked {new Date(capsule.unlockAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-32 rounded bg-muted/20 animate-pulse" />
                        <div className="h-4 w-24 rounded bg-muted/20 animate-pulse" />
                        <div className="h-4 w-16 rounded bg-muted/20 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {unlocked && !celebrating && (
                      <button
                        onClick={() => handleUnlockReveal(capsule.id)}
                        className="rounded-lg p-2 text-secondary hover:bg-secondary/20 transition-colors"
                        title="Celebrate!"
                      >
                        <PartyPopper className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(capsule.id)}
                      className="rounded-lg p-2 text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Delete capsule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AdBanner />
      </div>
    </main>
  );
}

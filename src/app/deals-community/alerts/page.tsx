'use client';

import { useState } from 'react';
import { Bell, Save } from 'lucide-react';

const categoryOptions = [
  'Electronics', 'Fashion', 'Home', 'Gaming', 'Travel',
  'Food', 'Fitness', 'Books', 'Kids',
];

const storeOptions = [
  'Amazon', 'Best Buy', 'Walmart', 'Target', 'Nike',
  'Apple', 'eBay', 'Macys', 'Costco', 'Home Depot',
];

export default function AlertsPage() {
  const [keywords, setKeywords] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('daily');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleStore = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🔔</p>
          <h1 className="text-3xl font-extrabold text-text-heading">Alerts Saved!</h1>
          <p className="text-text-body mt-3 max-w-md">
            We&apos;ll notify you when deals matching your preferences are posted.
          </p>
          <button
            onClick={() => setSaved(false)}
            className="mt-6 bg-deal-red hover:bg-deal-red-hover text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Edit Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-deal-gold" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-heading">
            Deal Alerts
          </h1>
        </div>
        <p className="text-text-body mb-8">
          Set up alerts to never miss a deal. We&apos;ll notify you when matching deals are posted.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Keywords */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-1.5">
              Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder='e.g. "AirPods", "4K TV", "Nike shoes"'
              className="w-full"
            />
            <p className="text-text-muted text-xs mt-1">
              Separate multiple keywords with commas
            </p>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-3">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategories.includes(cat)
                      ? 'bg-deal-red text-white'
                      : 'bg-card-bg border border-card-border text-text-muted hover:text-text-body'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stores */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-3">
              Stores
            </label>
            <div className="flex flex-wrap gap-2">
              {storeOptions.map((store) => (
                <button
                  key={store}
                  type="button"
                  onClick={() => toggleStore(store)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedStores.includes(store)
                      ? 'bg-deal-gold text-black'
                      : 'bg-card-bg border border-card-border text-text-muted hover:text-text-body'
                  }`}
                >
                  {store}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-3">
              Notification Frequency
            </label>
            <div className="flex gap-3">
              {[
                { value: 'instant', label: 'Instant' },
                { value: 'daily', label: 'Daily Digest' },
                { value: 'weekly', label: 'Weekly' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFrequency(opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    frequency === opt.value
                      ? 'bg-deal-red text-white'
                      : 'bg-card-bg border border-card-border text-text-muted hover:text-text-body'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-1.5">
              Email Address <span className="text-deal-red">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>

          {/* Save */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-deal-red hover:bg-deal-red-hover text-white font-bold py-3.5 rounded-xl transition-colors text-base"
          >
            <Save className="w-5 h-5" /> Save Alert Preferences
          </button>

          <p className="text-text-muted text-xs text-center">
            This is a placeholder — alert functionality will be connected to the backend in a future update.
          </p>
        </form>
      </div>
    </div>
  );
}

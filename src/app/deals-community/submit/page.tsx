'use client';

import { useState } from 'react';
import { Send, Upload, Info } from 'lucide-react';

const storeOptions = [
  'Amazon', 'Best Buy', 'Walmart', 'Target', 'Nike', 'Apple',
  'eBay', 'Macys', 'Costco', 'Home Depot', 'Newegg', 'Other',
];

const categoryOptions = [
  'Electronics', 'Fashion', 'Home', 'Gaming', 'Travel',
  'Food', 'Fitness', 'Books', 'Kids', 'Other',
];

export default function SubmitDealPage() {
  const [form, setForm] = useState({
    url: '',
    title: '',
    store: '',
    category: '',
    originalPrice: '',
    salePrice: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🎉</p>
          <h1 className="text-3xl font-extrabold text-text-heading">Deal Submitted!</h1>
          <p className="text-text-body mt-3 max-w-md">
            Thank you for sharing this deal. Our editors will review it and publish it shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 bg-deal-red hover:bg-deal-red-hover text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Submit Another Deal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-heading">
          Submit a Deal 🏷️
        </h1>
        <p className="text-text-body mt-2 mb-8">
          Found an amazing deal? Share it with the community. Submitted deals are reviewed before publishing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* URL */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-1.5">
              Deal URL <span className="text-deal-red">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://www.store.com/product-deal"
              required
              className="w-full"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-1.5">
              Deal Title <span className="text-deal-red">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Apple AirPods Pro 2 — 32% Off at Amazon"
              required
              className="w-full"
            />
          </div>

          {/* Store + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-heading text-sm font-semibold mb-1.5">
                Store <span className="text-deal-red">*</span>
              </label>
              <select
                name="store"
                value={form.store}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select store</option>
                {storeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-text-heading text-sm font-semibold mb-1.5">
                Category <span className="text-deal-red">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full"
              >
                <option value="">Select category</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-heading text-sm font-semibold mb-1.5">
                Original Price <span className="text-deal-red">*</span>
              </label>
              <input
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                placeholder="249.99"
                min="0"
                step="0.01"
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-text-heading text-sm font-semibold mb-1.5">
                Sale Price <span className="text-deal-red">*</span>
              </label>
              <input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleChange}
                placeholder="169.99"
                min="0"
                step="0.01"
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Any extra details, coupon codes, or tips for this deal..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Image Upload Placeholder */}
          <div>
            <label className="block text-text-heading text-sm font-semibold mb-1.5">
              Deal Image
            </label>
            <div className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-deal-red/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">
                Drag and drop an image, or click to upload
              </p>
              <p className="text-text-muted text-xs mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start gap-2 bg-card-bg border border-card-border rounded-xl p-4">
            <Info className="w-5 h-5 text-deal-gold shrink-0 mt-0.5" />
            <p className="text-text-muted text-sm">
              Submitted deals are reviewed by our editors before being published. This usually takes 1-2 hours during business hours.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full bg-deal-red hover:bg-deal-red-hover text-white font-bold py-3.5 rounded-xl transition-colors text-base"
          >
            <Send className="w-5 h-5" /> Submit Deal for Review
          </button>
        </form>
      </div>
    </div>
  );
}

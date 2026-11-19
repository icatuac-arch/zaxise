import Link from 'next/link';

const quickLinks = [
  { href: '/', label: "Today's Deals" },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About Us' },
];

const categories = [
  { href: '/deals/electronics', label: 'Electronics' },
  { href: '/deals/fashion', label: 'Fashion' },
  { href: '/deals/home', label: 'Home & Garden' },
  { href: '/deals/gaming', label: 'Gaming' },
  { href: '/deals/travel', label: 'Travel' },
  { href: '/deals/food', label: 'Food' },
  { href: '/deals/fitness', label: 'Fitness' },
  { href: '/deals/books', label: 'Books' },
  { href: '/deals/kids', label: 'Kids' },
];

const legal = [
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Affiliate Disclosure' },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👑</span>
              <span className="text-xl font-extrabold">
                <span className="text-blue-400">Deals</span>
                <span className="text-white">King</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your kingdom of savings. Community-voted deals, coupons, and discounts from the best stores online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              &copy; 2026 ZAXIS Ventures LLC. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs text-center sm:text-right max-w-md">
              Deals King features affiliate links. We may earn a commission when you shop through our links, at no extra cost to you.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

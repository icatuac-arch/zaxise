import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Building2, Users, BarChart3, Shield, Palette, Clock } from 'lucide-react';

const features = [
  { icon: Users, title: 'Multi-Client Management', desc: 'Manage 50+ client accounts from a single dashboard. Switch between brands in one click.' },
  { icon: Shield, title: 'Approval Workflows', desc: 'Clients approve content before it goes live. Custom approval chains for every account.' },
  { icon: Palette, title: 'White-Label Reports', desc: 'Generate branded PDF reports with your agency logo. Clients see your brand, not ours.' },
  { icon: BarChart3, title: 'Cross-Client Analytics', desc: 'Compare performance across all clients. Identify best practices and replicate success.' },
  { icon: Clock, title: 'Bulk Scheduling', desc: 'Schedule content for all clients in bulk. Import spreadsheets, plan months ahead.' },
  { icon: Building2, title: 'Client Portal', desc: 'Give each client their own login to view reports, approve posts, and communicate.' },
];

export default function AgenciesPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-violet-600 -top-32 -right-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-pink-600 -bottom-24 -left-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block text-sm font-semibold text-violet-400 mb-3 tracking-wider uppercase">For Agencies</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Scale your agency <span className="gradient-text-violet">without scaling costs</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Manage dozens of clients, automate reporting, and impress with white-label dashboards — all for free. No per-client fees, no seat limits that break the bank.
          </p>
          <Link href="/social/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Agency life is hard enough</h2>
            <p className="text-slate-400 max-w-xl mx-auto">You shouldn&apos;t need to pay $249/month per client just to schedule posts and pull reports. We built SocialMarketly for agencies who want power without the price tag.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="feature-card p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="feature-card p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Why agencies choose SocialMarketly</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Manage multiple client accounts from a single dashboard with easy switching</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">White-label reports with your agency branding for professional client deliverables</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">No per-client or per-seat pricing — scale your agency without scaling costs</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Approval workflows so clients can review and approve content before it goes live</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700 opacity-90" />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to scale your agency?</h2>
              <p className="text-white/80 mb-8">Free forever. Add unlimited clients. No per-seat pricing traps.</p>
              <Link href="/social/pricing" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight, Star, Globe, Shield, Key, Users, Cpu, Headphones } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Security-Focused Architecture', desc: 'Your data stays in your browser\'s local storage — we don\'t collect or transmit personal data. Privacy-first approach with standard security practices.' },
  { icon: Key, title: 'SSO & SAML', desc: 'Single sign-on with Okta, Azure AD, Google Workspace, and any SAML 2.0 provider. Centralized access control.' },
  { icon: Users, title: 'Advanced Permissions', desc: 'Granular role-based access. Control who can publish, who can draft, and who can view analytics — down to the account level.' },
  { icon: Cpu, title: 'API Access', desc: 'Full REST API for custom integrations. Connect SocialMarketly to your existing tech stack and internal tools.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Priority support with a dedicated account manager and responsive assistance.' },
  { icon: Globe, title: 'Global Scale', desc: 'Manage hundreds of accounts across regions. Multi-language support, timezone management, and regional compliance.' },
];

export default function EnterprisePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] bg-cyan-500 -top-32 -right-32" />
        <div className="bg-orb w-[400px] h-[400px] bg-violet-600 -bottom-24 -left-24" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <span className="inline-block text-sm font-semibold text-cyan-400 mb-3 tracking-wider uppercase">For Enterprise</span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
            Enterprise-grade. <span className="gradient-text-cyan">Zero compromises.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            The security, compliance, and scale your enterprise demands — with the simplicity your teams love. SSO, advanced permissions, API access, and dedicated support.
          </p>
          <Link href="/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
            Contact Sales <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Built for enterprise requirements</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything your IT, security, and compliance teams need — without the 6-month procurement cycle.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="feature-card p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
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
            <h3 className="text-xl font-bold text-white mb-4">Built for enterprise teams</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">SSO and granular permissions for centralized access control</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Full REST API for custom integrations with your tech stack</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Multi-region account management with timezone support</p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">Privacy-first architecture — your data stays in your browser</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-700 opacity-90" />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready for enterprise social?</h2>
              <p className="text-white/80 mb-8">Custom pricing for large teams. Dedicated support and onboarding included.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                Contact Sales <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

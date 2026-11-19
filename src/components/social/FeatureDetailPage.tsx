import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureDetailProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  gradient: string;
  color: string;
  highlights: string[];
  details: { title: string; desc: string }[];
}

export default function FeatureDetailPage({
  icon: Icon,
  title,
  tagline,
  description,
  gradient,
  color,
  highlights,
  details,
}: FeatureDetailProps) {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="bg-orb w-[500px] h-[500px] -top-32 -right-32" style={{ background: color }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">{title}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">{tagline}</p>
          <Link href="/pricing" className="btn-amber text-lg px-10 py-4 rounded-2xl inline-flex items-center gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Description + Highlights */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{description}</h2>
            <div className="space-y-3">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">{h}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-8 h-72 flex items-center justify-center">
            <Icon className="w-32 h-32 opacity-15" style={{ color }} />
          </div>
        </div>
      </section>

      {/* Detail Cards */}
      <section className="py-16 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.map((d) => (
              <div key={d.title} className="feature-card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{d.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
            <div className="relative py-14 px-8">
              <h2 className="text-3xl font-bold text-white mb-4">Start using {title} today</h2>
              <p className="text-white/80 mb-8">Free forever. No credit card required.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

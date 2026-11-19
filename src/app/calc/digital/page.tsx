import Link from 'next/link';

const calculators = [
  { name: 'Data Storage Converter', href: '/calc/data-storage', description: 'Convert between bytes, KB, MB, GB, TB, and other data units.' },
  { name: 'Number Base Converter', href: '/calc/number-base', description: 'Convert between binary, octal, decimal, and hexadecimal.' },
  { name: 'Color Converter', href: '/calc/color', description: 'Convert between RGB, HEX, HSL, and other color formats.' },
];

export default function DigitalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">Data & Digital Calculators</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">Tools for developers and tech enthusiasts: data sizes, number bases, and color conversions.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => (
          <Link key={calc.href} href={calc.href} className="bg-card border border-card-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
            <h2 className="font-semibold text-lg text-primary group-hover:underline mb-2">{calc.name}</h2>
            <p className="text-sm text-muted">{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';

const calculators = [
  { name: 'Age Calculator', href: '/calc/age', description: 'Calculate exact age in years, months, and days between two dates.' },
  { name: 'Fuel Cost Calculator', href: '/calc/fuel', description: 'Calculate trip fuel costs based on distance, efficiency, and gas price.' },
  { name: 'Shoe Size Converter', href: '/calc/shoe-size', description: 'Convert between US, UK, EU, and other shoe size systems.' },
  { name: 'Paper Size Reference', href: '/calc/paper-size', description: 'Compare A-series, Letter, Legal, and other paper dimensions.' },
  { name: 'Cooking Converter', href: '/calc/cooking', description: 'Convert cooking measurements: cups, tbsp, tsp, ml, and more.' },
  { name: 'Recipe Scaler', href: '/calc/recipe-scaler', description: 'Scale recipe ingredient amounts up or down.' },
  { name: 'Time Converter', href: '/calc/time-converter', description: 'Convert between seconds, minutes, hours, days, and years.' },
];

export default function EverydayPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">Everyday Calculators</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">Handy tools for daily life: fuel costs, age calculations, shoe sizes, and paper dimensions.</p>
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

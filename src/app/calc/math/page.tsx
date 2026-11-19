import Link from 'next/link';

const calculators = [
  { name: 'Percentage Calculator', href: '/calc/percentage', description: 'Calculate percentages, percentage change, and percentage of a number.' },
  { name: 'Fraction Calculator', href: '/calc/fraction', description: 'Add, subtract, multiply, and divide fractions with step-by-step solutions.' },
  { name: 'Scientific Notation', href: '/calc/scientific', description: 'Convert between decimal numbers and scientific notation (a x 10^n).' },
  { name: 'Prime Number Checker', href: '/calc/prime', description: 'Check if a number is prime and find prime factorizations.' },
  { name: 'GCD & LCM Calculator', href: '/calc/gcd-lcm', description: 'Find the greatest common divisor and least common multiple.' },
];

export default function MathPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">Math & Numbers Calculators</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">Percentages, fractions, primes, and more. Tools for everyday math and number theory.</p>
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

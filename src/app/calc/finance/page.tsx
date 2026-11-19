import Link from 'next/link';

const calculators = [
  { name: 'Loan Calculator', href: '/calc/loan', description: 'Calculate monthly payments, total interest, and amortization schedules for any loan.' },
  { name: 'Home Loan (Advanced)', href: '/calc/home-loan', description: 'Comprehensive mortgage calculator with taxes, insurance, and PMI.' },
  { name: 'Compound Interest', href: '/calc/compound-interest', description: 'See how your money grows over time with compound interest.' },
  { name: 'Tip Calculator', href: '/calc/tip', description: 'Quickly calculate tips and split bills among groups.' },
  { name: 'Salary Converter', href: '/calc/salary', description: 'Convert between hourly, weekly, monthly, and annual salary.' },
  { name: 'Discount Calculator', href: '/calc/discount', description: 'Find sale prices and savings from percentage discounts.' },
  { name: 'ROI Calculator', href: '/calc/roi', description: 'Calculate return on investment and annualized returns.' },
];

export default function FinancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">Finance Calculators</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">Loans, interest, tips, salary conversions, and more. Make smarter financial decisions with these tools.</p>
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

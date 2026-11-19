import Link from 'next/link';

const calculators = [
  { name: 'BMI Calculator', href: '/calc/bmi', description: 'Calculate your Body Mass Index and see where you fall on the scale.' },
  { name: 'Calorie Calculator', href: '/calc/calorie', description: 'Estimate daily calorie needs based on your activity level and goals.' },
  { name: 'Body Fat Calculator', href: '/calc/body-fat', description: 'Estimate body fat percentage using body measurements.' },
  { name: 'Heart Rate Zones', href: '/calc/heart-rate', description: 'Find your target heart rate zones for optimal training.' },
  { name: 'Water Intake Calculator', href: '/calc/water-intake', description: 'Calculate how much water you should drink daily.' },
];

export default function HealthPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">Health & Fitness Calculators</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto">Track your health metrics, plan your nutrition, and optimize your workouts.</p>
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

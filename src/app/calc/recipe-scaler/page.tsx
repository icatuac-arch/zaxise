'use client';

import { useState } from 'react';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export default function RecipeScalerPage() {
  const [originalServings, setOriginalServings] = useState('4');
  const [desiredServings, setDesiredServings] = useState('8');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Flour', amount: '2', unit: 'cups' },
    { name: 'Sugar', amount: '1', unit: 'cup' },
    { name: 'Butter', amount: '0.5', unit: 'cup' },
    { name: 'Eggs', amount: '3', unit: '' },
    { name: 'Milk', amount: '1.5', unit: 'cups' },
  ]);

  const origServ = parseFloat(originalServings) || 1;
  const desServ = parseFloat(desiredServings) || 1;
  const multiplier = desServ / origServ;

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const formatAmount = (amount: string): string => {
    const num = parseFloat(amount) * multiplier;
    if (isNaN(num)) return '—';
    // Show clean fractions for common values
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2).replace(/\.?0+$/, '');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Recipe Scaler</h1>
        <p className="text-muted">Scale recipe ingredients up or down based on your desired number of servings.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        {/* Servings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Original Servings</label>
            <input type="number" min="1" value={originalServings} onChange={(e) => setOriginalServings(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Desired Servings</label>
            <input type="number" min="1" value={desiredServings} onChange={(e) => setDesiredServings(e.target.value)} className="w-full px-4 py-3 border border-card-border rounded-lg text-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          </div>
          <div className="bg-primary/10 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className="text-sm text-muted mb-1">Multiplier</div>
            <div className="text-2xl font-bold font-mono text-primary">{multiplier.toFixed(2)}x</div>
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-3 px-2 font-medium text-muted">Ingredient</th>
                <th className="text-left py-3 px-2 font-medium text-muted">Original</th>
                <th className="text-left py-3 px-2 font-medium text-muted">Unit</th>
                <th className="text-left py-3 px-2 font-medium text-primary">Scaled</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr key={i} className="border-b border-card-border last:border-0">
                  <td className="py-2 px-2">
                    <input type="text" value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} className="w-full px-2 py-1 border border-card-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Name" />
                  </td>
                  <td className="py-2 px-2">
                    <input type="number" step="any" value={ing.amount} onChange={(e) => updateIngredient(i, 'amount', e.target.value)} className="w-20 px-2 py-1 border border-card-border rounded text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary" />
                  </td>
                  <td className="py-2 px-2">
                    <input type="text" value={ing.unit} onChange={(e) => updateIngredient(i, 'unit', e.target.value)} className="w-20 px-2 py-1 border border-card-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="cups" />
                  </td>
                  <td className="py-2 px-2">
                    <span className="font-mono font-semibold text-primary">{formatAmount(ing.amount)} {ing.unit}</span>
                  </td>
                  <td className="py-2 px-1">
                    <button onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-600 text-lg" title="Remove">x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addIngredient} className="mt-3 px-4 py-2 bg-background border border-card-border rounded-lg text-sm font-medium text-dark hover:bg-gray-100 transition-colors">
          + Add Ingredient
        </button>
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">How It Works</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          Scaled Amount = Original Amount x (Desired Servings / Original Servings)
        </div>
        <p className="text-xs text-muted mt-3">
          Note: Cooking times and oven temperatures usually do not scale linearly. For baked goods, scaling beyond 2x may require recipe adjustments.
        </p>
      </div>
    </div>
  );
}

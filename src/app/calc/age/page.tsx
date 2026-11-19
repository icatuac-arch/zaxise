'use client';

import { useState } from 'react';

export default function AgePage() {
  const today = new Date();
  const defaultDate = `${today.getFullYear() - 25}-01-15`;
  const [birthdate, setBirthdate] = useState(defaultDate);

  const birth = new Date(birthdate);
  const isValid = birthdate && !isNaN(birth.getTime()) && birth < today;

  let years = 0, months = 0, days = 0;
  let totalDays = 0, totalWeeks = 0, totalMonths = 0, totalHours = 0;
  let nextBirthday = '';

  if (isValid) {
    let y = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();
    let d = today.getDate() - birth.getDate();

    if (d < 0) {
      m--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    years = y;
    months = m;
    days = d;

    const diffMs = today.getTime() - birth.getTime();
    totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    totalWeeks = Math.floor(totalDays / 7);
    totalMonths = years * 12 + months;
    totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= today) {
      nextBday.setFullYear(nextBday.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfWeek = nextBday.toLocaleDateString('en-US', { weekday: 'long' });
    nextBirthday = `${nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${dayOfWeek}) — ${daysUntil} days away`;
  }

  const dayBorn = isValid ? birth.toLocaleDateString('en-US', { weekday: 'long' }) : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Age Calculator</h1>
        <p className="text-muted">Calculate your exact age in years, months, days, and more from your date of birth.</p>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted mb-2">Date of Birth</label>
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full max-w-xs px-4 py-3 border border-card-border rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
          {dayBorn && <div className="text-sm text-muted mt-1">Born on a {dayBorn}</div>}
        </div>

        {isValid && (
          <>
            <div className="bg-primary/10 rounded-xl p-6 text-center mb-6">
              <div className="text-sm text-muted mb-2">Your Age</div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div>
                  <div className="text-4xl font-bold font-mono text-primary">{years}</div>
                  <div className="text-xs text-muted">years</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-primary">{months}</div>
                  <div className="text-xs text-muted">months</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-primary">{days}</div>
                  <div className="text-xs text-muted">days</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="text-xs text-muted mb-1">Total Months</div>
                <div className="text-lg font-bold font-mono text-dark">{totalMonths.toLocaleString()}</div>
              </div>
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="text-xs text-muted mb-1">Total Weeks</div>
                <div className="text-lg font-bold font-mono text-dark">{totalWeeks.toLocaleString()}</div>
              </div>
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="text-xs text-muted mb-1">Total Days</div>
                <div className="text-lg font-bold font-mono text-dark">{totalDays.toLocaleString()}</div>
              </div>
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="text-xs text-muted mb-1">Total Hours</div>
                <div className="text-lg font-bold font-mono text-dark">{totalHours.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <div className="text-sm text-muted mb-1">Next Birthday</div>
              <div className="text-sm font-medium text-yellow-700">{nextBirthday}</div>
            </div>
          </>
        )}
      </div>

      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-dark mb-3">How It Works</h2>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-dark-light">
          Age is calculated by subtracting the birth date from today&apos;s date, accounting for varying month lengths and leap years.
        </div>
      </div>
    </div>
  );
}

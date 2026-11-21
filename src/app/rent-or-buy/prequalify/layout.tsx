import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortgage Pre-Qualification Calculator — How Much Can You Borrow? | RentOrBuy',
  description:
    'Free mortgage pre-qualification calculator. Enter your income and debts to instantly see how much home you could afford.',
  keywords:
    'mortgage pre-qualification, how much can I borrow, mortgage calculator, home affordability',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

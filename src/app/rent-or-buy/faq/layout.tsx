import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ — First-Time Home Buyer Questions Answered | RentOrBuy',
  description:
    '22 frequently asked questions about buying your first home. Get clear, plain-English answers about mortgages, down payments, closing costs, and more.',
  keywords:
    'home buying FAQ, first time buyer questions, mortgage questions, down payment questions',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

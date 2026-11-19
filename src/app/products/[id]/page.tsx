import { notFound, redirect } from "next/navigation";
import { products } from "@/lib/products";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.tagline} | Zaxise`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  // Redirect to the actual product URL
  redirect(product.url);
}

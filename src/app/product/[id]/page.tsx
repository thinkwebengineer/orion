import { notFound } from "next/navigation";
import { getProductById, getAllProducts } from "@/lib/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

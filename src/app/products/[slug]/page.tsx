import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { formatPrice } from '@/lib/utils';
import { Shield, Truck, RefreshCcw } from 'lucide-react';

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return notFound();

  const images: string[] = JSON.parse(product.images);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image src={images[0]} alt={product.name} fill className="object-cover" />
            {product.salePrice && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">SALE</span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">
            {product.category.name} - {product.brand}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold text-red-600">{formatPrice(product.salePrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">SKU</span>
              <span className="font-medium">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stock</span>
              <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
          </div>
          <AddToCartButton product={product} />
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center"><Truck className="w-6 h-6 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Free Shipping</p></div>
            <div className="text-center"><Shield className="w-6 h-6 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">2yr Warranty</p></div>
            <div className="text-center"><RefreshCcw className="w-6 h-6 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">30-Day Returns</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

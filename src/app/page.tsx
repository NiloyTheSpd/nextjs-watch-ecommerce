import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/products/ProductCard';
import { ArrowRight, Shield, Truck, RefreshCcw, Star } from 'lucide-react';

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 4,
  });

  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-4">
              New Collection 2026
            </p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Time Crafted to
              <span className="text-blue-400"> Perfection</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover our exclusive collection of premium timepieces — from Swiss luxury to cutting-edge smartwatches.
            </p>
            <div className="flex gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop?category=luxury"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Luxury Collection
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Free Shipping Over $500</div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> 2-Year Warranty</div>
            <div className="flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> 30-Day Returns</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4" /> Certified Authentic</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">
                    {cat.slug === 'luxury' ? '👑' : cat.slug === 'sport' ? '🏃' : cat.slug === 'classic' ? '⌚' : '📱'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat._count.products} watches</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Watches</h2>
            <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Find Your Perfect Timepiece</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Browse our full collection of over 100 premium watches with worldwide shipping.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Explore Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

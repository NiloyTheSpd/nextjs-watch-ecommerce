import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Edit, Plus, Package } from 'lucide-react';

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/login');

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.brand} - {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{product.category.name}</td>
                <td className="px-6 py-4 text-sm font-semibold">{formatPrice(product.salePrice ?? product.price)}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>{product.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.featured ? 'Yes' : 'No'}</span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

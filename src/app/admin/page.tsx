import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Eye } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    redirect('/login');
  }

  const [totalProducts, totalOrders, totalUsers, recentOrders, revenue] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.user.count(),
    db.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.order.aggregate({ _sum: { total: true } }),
  ]);

  const stats = [
    { label: 'Total Revenue', value: formatPrice(revenue._sum.total ?? 0), icon: DollarSign, color: 'bg-green-500', change: '+12.5%' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-500', change: '+8.2%' },
    { label: 'Products', value: totalProducts.toString(), icon: Package, color: 'bg-purple-500', change: '+2 new' },
    { label: 'Customers', value: totalUsers.toString(), icon: Users, color: 'bg-orange-500', change: '+15 new' },
  ];

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {session.user.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/products/new" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center font-semibold transition-colors">
          + Add New Product
        </Link>
        <Link href="/admin/products" className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-center font-semibold transition-colors">
          Manage Products
        </Link>
        <Link href="/admin/orders" className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-center font-semibold transition-colors">
          Manage Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm">{order.user.name || order.user.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

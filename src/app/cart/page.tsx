'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some watches to get started!</p>
        <Link href="/shop" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-block transition-colors">
          Shop Watches
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({items.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-semibold text-gray-800 hover:text-blue-600">{item.name}</Link>
                <p className="text-blue-600 font-bold mt-1">{formatPrice(item.salePrice ?? item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="font-bold">{formatPrice((item.salePrice ?? item.price) * item.quantity)}</p>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(getTotalPrice())}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span><span>{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
          <Link href="/checkout" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="w-full block text-center text-blue-600 hover:text-blue-800 py-2 mt-3 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

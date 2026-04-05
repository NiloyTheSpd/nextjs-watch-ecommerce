'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cart';
import { ShoppingCart, Watch, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <Watch className="w-6 h-6 text-blue-600" />
          WatchStore
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/shop" className="text-gray-600 hover:text-gray-900 font-medium">Shop</Link>
          <Link href="/shop?category=luxury" className="text-gray-600 hover:text-gray-900 font-medium">Luxury</Link>
          <Link href="/shop?category=sport" className="text-gray-600 hover:text-gray-900 font-medium">Sport</Link>
          <Link href="/shop?category=smartwatch" className="text-gray-600 hover:text-gray-900 font-medium">Smart</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {session ? (
            <div className="hidden md:flex items-center gap-2">
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" className="flex items-center gap-1 text-sm text-purple-600 font-medium">
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
              )}
              <span className="text-sm text-gray-600">{session.user?.name}</span>
              <button onClick={() => signOut()} className="text-red-500 hover:text-red-700">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Sign In</Link>
          )}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4 space-y-3 bg-white">
          <Link href="/shop" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>Shop</Link>
          {session ? (
            <button onClick={() => signOut()} className="block text-red-500 font-medium py-2">Sign Out</button>
          ) : (
            <Link href="/login" className="block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}

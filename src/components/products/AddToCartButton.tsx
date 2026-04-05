'use client';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';

interface Props {
  product: { id: string; name: string; price: number; image: string; slug: string; stock: number };
}

export default function AddToCartButton({ product }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleClick = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0)
    return <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed">Out of Stock</button>;

  return (
    <button onClick={handleClick} className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
      {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  );
}

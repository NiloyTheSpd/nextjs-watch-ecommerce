import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit');

  const where: any = {};
  if (category) where.category = { slug: category };
  if (featured === 'true') where.featured = true;

  const products = await db.product.findMany({
    where,
    include: { category: true },
    take: limit ? parseInt(limit) : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { images, ...data } = body;

  const product = await db.product.create({
    data: { ...data, images: JSON.stringify(images) },
    include: { category: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}

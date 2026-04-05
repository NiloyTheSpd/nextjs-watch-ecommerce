import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@watchstore.com' },
    update: {},
    create: {
      email: 'admin@watchstore.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create categories
  const luxury = await prisma.category.upsert({
    where: { slug: 'luxury' },
    update: {},
    create: { name: 'Luxury', slug: 'luxury' },
  });
  const sport = await prisma.category.upsert({
    where: { slug: 'sport' },
    update: {},
    create: { name: 'Sport', slug: 'sport' },
  });
  const classic = await prisma.category.upsert({
    where: { slug: 'classic' },
    update: {},
    create: { name: 'Classic', slug: 'classic' },
  });
  const smartwatch = await prisma.category.upsert({
    where: { slug: 'smartwatch' },
    update: {},
    create: { name: 'Smartwatch', slug: 'smartwatch' },
  });

  // Create products
  const products = [
    {
      name: 'Chronos Elite Gold',
      slug: 'chronos-elite-gold',
      description: 'A stunning luxury timepiece with 18k gold case, sapphire crystal glass, and Swiss automatic movement. Water resistant to 50m.',
      price: 2499.99,
      salePrice: 1999.99,
      images: JSON.stringify(['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600']),
      stock: 15,
      brand: 'Chronos',
      sku: 'CHR-ELT-GLD-001',
      featured: true,
      categoryId: luxury.id,
    },
    {
      name: 'Apex Titanium Pro',
      slug: 'apex-titanium-pro',
      description: 'Built for athletes and adventurers. Titanium case, GPS tracking, heart rate monitor, and 72-hour battery life.',
      price: 799.99,
      salePrice: null,
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600']),
      stock: 42,
      brand: 'Apex',
      sku: 'APX-TIT-PRO-001',
      featured: true,
      categoryId: sport.id,
    },
    {
      name: 'Heritage Moonphase',
      slug: 'heritage-moonphase',
      description: 'Timeless elegance meets horological artistry. Hand-wound movement with moonphase complication, crocodile leather strap.',
      price: 3299.00,
      salePrice: null,
      images: JSON.stringify(['https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600']),
      stock: 8,
      brand: 'Heritage',
      sku: 'HRT-MON-PHS-001',
      featured: false,
      categoryId: classic.id,
    },
    {
      name: 'NexWatch Ultra S2',
      slug: 'nexwatch-ultra-s2',
      description: 'Next-generation smartwatch with AMOLED display, health monitoring, AI assistant, and 5-day battery life.',
      price: 449.00,
      salePrice: 399.00,
      images: JSON.stringify(['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600']),
      stock: 100,
      brand: 'NexWatch',
      sku: 'NEX-ULT-S2-001',
      featured: true,
      categoryId: smartwatch.id,
    },
    {
      name: 'Marine Diver 300',
      slug: 'marine-diver-300',
      description: 'Professional diving watch with 300m water resistance, unidirectional bezel, luminous hands, and helium escape valve.',
      price: 1199.00,
      salePrice: 999.00,
      images: JSON.stringify(['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600']),
      stock: 25,
      brand: 'Marine',
      sku: 'MRN-DVR-300-001',
      featured: true,
      categoryId: sport.id,
    },
    {
      name: 'Vintage Pilot Chronograph',
      slug: 'vintage-pilot-chronograph',
      description: 'Inspired by classic aviation instruments. Anti-magnetic, slide rule bezel, and precise chronograph function.',
      price: 1599.00,
      salePrice: null,
      images: JSON.stringify(['https://images.unsplash.com/photo-1509941943102-10c232535736?w=600']),
      stock: 18,
      brand: 'AviTime',
      sku: 'AVT-PLT-CHR-001',
      featured: false,
      categoryId: classic.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Seed completed successfully!');
  console.log('Admin credentials:', admin.email, '/ admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.umkmProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching UMKM products:', error);
    return NextResponse.json({ error: 'Failed to fetch UMKM products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, priceUnit, category, seller, description, image, badge } = body;

    if (!name || !price || !category || !seller || !description || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await prisma.umkmProduct.create({
      data: {
        name,
        price: Number(price),
        priceUnit: priceUnit || 'pcs',
        category,
        seller,
        description,
        image,
        badge,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating UMKM product:', error);
    return NextResponse.json({ error: 'Failed to create UMKM product' }, { status: 500 });
  }
}

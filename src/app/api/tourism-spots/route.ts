import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const spots = await prisma.tourismSpot.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching tourism spots:', error);
    return NextResponse.json({ error: 'Failed to fetch tourism spots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, description, image, badge, rating } = body;

    if (!title || !category || !description || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newSpot = await prisma.tourismSpot.create({
      data: {
        title,
        category,
        description,
        image,
        badge: badge || 'Destinasi',
        rating: rating !== undefined ? Number(rating) : 4.9,
      },
    });

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    console.error('Error creating tourism spot:', error);
    return NextResponse.json({ error: 'Failed to create tourism spot' }, { status: 500 });
  }
}

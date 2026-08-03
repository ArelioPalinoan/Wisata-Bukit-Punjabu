import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.visitorReview.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching visitor reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, origin, rating, comment, avatar, spot } = body;

    if (!name || !origin || !rating || !comment || !spot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formattedDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const newReview = await prisma.visitorReview.create({
      data: {
        name,
        origin,
        rating: Number(rating),
        date: formattedDate,
        comment,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`,
        spot,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating visitor review:', error);
    return NextResponse.json({ error: 'Failed to create visitor review' }, { status: 500 });
  }
}

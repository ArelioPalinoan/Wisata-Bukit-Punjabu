import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, category } = body;

    if (!question || !answer || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFaq = await prisma.faq.create({
      data: {
        question,
        answer,
        category,
      },
    });

    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

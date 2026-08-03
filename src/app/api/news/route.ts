import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATABASE_URL is not configured in environment variables.',
          hint: 'Add DATABASE_URL to your .env.local file from your Supabase Connection String.',
        },
        { status: 503 }
      );
    }

    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, count: news.length, data: news });
  } catch (error) {
    console.error('Error fetching news with Prisma:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, error: 'DATABASE_URL is not configured.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, category, author, summary, content, coverImage, tags, gallery } = body;

    if (!title || !category || !summary || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, category, summary, content' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const newArticle = await prisma.news.create({
      data: {
        title,
        slug,
        category,
        author: author || 'Tim Redaksi Desa',
        authorRole: 'Pengelola Wisata',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        summary,
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        tags: Array.isArray(tags) ? tags : [],
        gallery: Array.isArray(gallery) ? gallery : [],
      },
    });

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    console.error('Error creating news with Prisma:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create news' },
      { status: 500 }
    );
  }
}

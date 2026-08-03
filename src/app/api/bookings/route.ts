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

    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings with Prisma:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch bookings' },
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
    const { userName, userPhone, userEmail, bookingDate, ticketQty, tentQty, guideIncluded, totalPrice, notes } = body;

    if (!userName || !userPhone || !bookingDate || totalPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userName, userPhone, bookingDate, totalPrice' },
        { status: 400 }
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        userName,
        userPhone,
        userEmail: userEmail || null,
        bookingDate: new Date(bookingDate),
        ticketQty: Number(ticketQty) || 1,
        tentQty: Number(tentQty) || 0,
        guideIncluded: Boolean(guideIncluded),
        totalPrice: Number(totalPrice),
        notes: notes || null,
        status: 'Pending',
      },
    });

    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking with Prisma:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    );
  }
}

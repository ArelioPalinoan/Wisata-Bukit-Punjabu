import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const routes = await prisma.travelRoute.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error fetching travel routes:', error);
    return NextResponse.json({ error: 'Failed to fetch travel routes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromLocation, distance, duration, roadCondition, vehicleAdvice } = body;

    if (!fromLocation || !distance || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRoute = await prisma.travelRoute.create({
      data: {
        fromLocation,
        distance,
        duration,
        roadCondition: roadCondition || 'Akses baik',
        vehicleAdvice: vehicleAdvice || 'Semua jenis kendaraan',
      },
    });

    return NextResponse.json(newRoute, { status: 201 });
  } catch (error) {
    console.error('Error creating travel route:', error);
    return NextResponse.json({ error: 'Failed to create travel route' }, { status: 500 });
  }
}

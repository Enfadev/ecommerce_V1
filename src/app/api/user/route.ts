import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// API route untuk mengambil semua user tanpa field password
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 });
  }
}

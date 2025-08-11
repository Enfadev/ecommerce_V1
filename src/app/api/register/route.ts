import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { signJWT, setAuthCookie } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = await signJWT({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      user: {
        ...user,
        id: user.id.toString(),
      },
      message: 'Registration successful'
    });

    // Set httpOnly cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    // Only log detailed errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Registration error:', error);
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

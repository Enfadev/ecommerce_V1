import { NextResponse } from 'next/server';
import { compare, hash } from 'bcryptjs';
import { signJWT, setAuthCookie } from '@/lib/jwt';

// Temporary in-memory storage for development testing
// In production, this should use database
const users = new Map([
  ['admin@test.com', {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: '', // Will be set below
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
  }],
  ['user@test.com', {
    id: '2',
    name: 'Regular User',
    email: 'user@test.com',
    password: '', // Will be set below
    role: 'USER',
    createdAt: new Date().toISOString(),
  }]
]);

// Initialize test users with hashed passwords
async function initTestUsers() {
  const adminUser = users.get('admin@test.com');
  const regularUser = users.get('user@test.com');
  
  if (adminUser && !adminUser.password) {
    adminUser.password = await hash('admin123', 12);
  }
  
  if (regularUser && !regularUser.password) {
    regularUser.password = await hash('user123', 12);
  }
}

export async function POST(req: Request) {
  try {
    await initTestUsers();
    
    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user in memory storage
    const user = users.get(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = await signJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Prepare user data (exclude password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userData } = user;

    // Create response and set cookie
    const response = NextResponse.json({
      user: userData,
      message: 'Sign in successful'
    });

    // Set httpOnly cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

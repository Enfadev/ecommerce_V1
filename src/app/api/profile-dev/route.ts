import { NextRequest, NextResponse } from 'next/server';

// Mock user data for development testing
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'ADMIN',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  try {
    // Get user info from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Return mock user data with info from JWT
    const user = {
      id: userId,
      name: mockUser.name,
      email: userEmail || mockUser.email,
      role: userRole || mockUser.role,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    };

    return NextResponse.json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all categories from the Category table
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const categoryList = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      productCount: cat._count.products
    }));

    return NextResponse.json({
      success: true,
      categories: categoryList
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        categories: []
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category name is required' 
        },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: cleanName
      }
    });

    if (existingCategory) {
      return NextResponse.json({
        success: true,
        message: 'Category already exists',
        category: existingCategory
      });
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: {
        name: cleanName
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });

  } catch (error) {
    console.error('Error handling category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to handle category' 
      },
      { status: 500 }
    );
  }
}

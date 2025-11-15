import { NextRequest, NextResponse } from "next/server";
import { validateCreateProduct, validateUpdateProduct, validateDeleteProduct } from "@/lib/validators/product";
import { getProducts, formatProductWithSales, createProduct, createProductImages, updateProduct, updateProductImages, hasExistingOrders, deactivateProduct, deleteProduct, disconnectPrisma } from "@/lib/queries/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const { products, totalCount } = await getProducts({
      page,
      limit,
      search,
      category,
    });

    const formattedProducts = products.map(formatProductWithSales);

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateCreateProduct(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const product = await createProduct(validation.data!);

    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      await createProductImages(product.id, body.images);
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateUpdateProduct(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { productId, updateData } = validation.data as {
      productId: number;
      updateData: Record<string, unknown>;
    };

    const product = await updateProduct(productId, updateData);

    if (body.images && Array.isArray(body.images)) {
      await updateProductImages(productId, body.images);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const validation = validateDeleteProduct(id);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { productId } = validation.data as { productId: number };

    const hasOrders = await hasExistingOrders(productId);

    if (hasOrders) {
      const product = await deactivateProduct(productId);
      return NextResponse.json({
        message: "Product deactivated (has existing orders)",
        product,
      });
    }

    await deleteProduct(productId);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await disconnectPrisma();
  }
}

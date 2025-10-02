
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Types
interface ProductData {
  id: string;
  productName: string;
  productDescription: string;
  distinguishingFeature: string;
  businessModel: 'b2b-subscription' | 'b2b-one-time';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage (replace with database in production)
const productStorage = new Map<string, ProductData[]>();

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productName, productDescription, distinguishingFeature, businessModel } = body;

    // Validate required fields
    if (!productName || !productDescription || !distinguishingFeature || !businessModel) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create product data
    const productData: ProductData = {
      id: `product-${Date.now()}`,
      productName,
      productDescription,
      distinguishingFeature,
      businessModel,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store product data using user ID
    const userProducts = productStorage.get(user.id) || [];
    userProducts.unshift(productData); // Add to beginning
    productStorage.set(user.id, userProducts.slice(0, 4)); // Keep last 4

    return NextResponse.json({
      success: true,
      product: productData,
      message: 'Product details saved successfully'
    });

  } catch (error) {
    console.error('Error saving product details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userProducts = productStorage.get(user.id) || [];

    return NextResponse.json({
      success: true,
      products: userProducts
    });

  } catch (error) {
    console.error('Error retrieving product details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

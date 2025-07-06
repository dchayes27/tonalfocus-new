/**
 * src/app/api/photos/route.ts
 * -----------------------------
 * This API route handler is responsible for fetching a list of photos.
 * It supports filtering by category and a 'featured' status, as well as pagination.
 * Data is retrieved from a Supabase database.
 */
import { NextRequest, NextResponse } from 'next/server'; // Next.js server utilities for handling requests and responses.
import { createClient } from '@/lib/supabase-server'; // Custom Supabase client for server-side operations.

/**
 * Handles GET requests to the /api/photos endpoint.
 * Fetches photos based on query parameters for category, limit, offset, and featured status.
 *
 * @param {NextRequest} request - The incoming Next.js request object, containing URL search parameters.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 *          On success, returns a JSON response with an array of photos and pagination information.
 *          On failure, returns a JSON response with an error message and a 500 status code.
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize the Supabase client.
    const supabase = createClient();
    // Access URL search parameters from the request.
    const searchParams = request.nextUrl.searchParams;
    
    // Retrieve and parse query parameters for filtering and pagination.
    const category = searchParams.get('category'); // Category slug (e.g., 'portraits', 'landscapes').
    const limit = parseInt(searchParams.get('limit') || '20', 10); // Number of photos per page, default 20.
    const offset = parseInt(searchParams.get('offset') || '0', 10); // Starting index for pagination, default 0.
    const featured = searchParams.get('featured') === 'true'; // Boolean flag to filter featured photos.

    // Start building the Supabase query to fetch photos.
    let query = supabase
      .from('photos') // Target the 'photos' table.
      .select(`
        *,
        category:categories(*)
      `)
      // Select all columns from 'photos' and join related data from 'categories' table.
      // 'category:categories(*)' fetches all columns from the related 'categories' record
      // and nests it under a 'category' key in each photo object.
      // This assumes a foreign key relationship is set up in Supabase (e.g., photos.category_id references categories.id).
      .order('display_order', { ascending: true }) // Order photos by their display_order.
      .range(offset, offset + limit - 1); // Apply pagination using range (offset to offset + limit - 1).

    // Apply category filter if a category slug is provided.
    if (category) {
      // First, fetch the category ID corresponding to the provided slug.
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id') // Select only the ID.
        .eq('slug', category) // Filter by the slug.
        .single(); // Expect a single category record.
      
      // If there was an error fetching the category or no category was found, log it (optional: could also return an error).
      if (categoryError || !categoryData) {
        console.error(`Category with slug '${category}' not found or error fetching:`, categoryError);
        // Depending on requirements, you might want to return an empty set or an error here.
        // For now, it will proceed without the category filter if not found.
      } else if (categoryData) {
        // If category ID is found, add a filter to the main photos query.
        query = query.eq('category_id', categoryData.id);
      }
    }
    
    // Apply featured filter if the 'featured' query parameter is true.
    if (featured) {
      query = query.eq('is_featured', true); // Filter for photos where is_featured is true.
    }

    // Execute the constructed query.
    const { data, error } = await query;

    // Handle potential errors from the Supabase query.
    if (error) {
      console.error('Error fetching photos:', error);
      return NextResponse.json(
        { error: error.message }, // Return the Supabase error message.
        { status: 500 } // Internal Server Error.
      );
    }

    // Return the fetched photos and pagination details.
    return NextResponse.json({ 
      photos: data || [], // Default to an empty array if no data is returned.
      pagination: {
        limit,
        offset,
        hasMore: data ? data.length === limit : false // Indicates if there might be more photos to fetch.
      }
    });
  } catch (error) {
    // Catch any unexpected errors during the process.
    console.error('Unexpected error in GET /api/photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, // Generic error message.
      { status: 500 } // Internal Server Error.
    );
  }
}

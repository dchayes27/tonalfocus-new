/**
 * src/app/api/photos/route.ts
 * -----------------------------
 * This API route handler is responsible for fetching a list of photos.
 * It supports filtering by category and a 'featured' status, as well as pagination.
 * Data is retrieved from a Supabase database.
 */
import { NextRequest, NextResponse } from 'next/server'; // Next.js server utilities for handling requests and responses.
import { createPublicClient } from '@/lib/supabase-public'; // Cookie-less Supabase client for public data.

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
    const supabase = createPublicClient();
    // Access URL search parameters without using nextUrl to avoid static bailouts.
    const searchParams = new URL(request.url).searchParams;
    
    // Retrieve and parse query parameters for filtering and pagination.
    const view = searchParams.get('view'); // 'all', 'color', 'bw'
    const limit = parseInt(searchParams.get('limit') || '50', 10); // Number of photos per page, default 50.
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
      .order('is_black_white', { ascending: false }) // Group B&W photos first
      .order('display_order', { ascending: true }) // Then order by display_order
      .range(offset, offset + limit - 1); // Apply pagination using range.

    // Apply view filter for B&W vs Color
    if (view === 'bw') {
      query = query.eq('is_black_white', true);
    } else if (view === 'color') {
      query = query.eq('is_black_white', false);
    }
    // 'all' view doesn't need filtering, shows both
    
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

    // Group photos by B&W vs Color for the 'all' view
    let response;
    if (view === 'all' || !view) {
      const blackWhitePhotos = data?.filter(photo => photo.is_black_white) || [];
      const colorPhotos = data?.filter(photo => !photo.is_black_white) || [];
      
      response = {
        photos: data || [],
        grouped: {
          blackWhite: blackWhitePhotos,
          color: colorPhotos
        },
        pagination: {
          limit,
          offset,
          hasMore: data ? data.length === limit : false
        }
      };
    } else {
      response = {
        photos: data || [],
        pagination: {
          limit,
          offset,
          hasMore: data ? data.length === limit : false
        }
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    // Catch any unexpected errors during the process.
    console.error('Unexpected error in GET /api/photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, // Generic error message.
      { status: 500 } // Internal Server Error.
    );
  }
}

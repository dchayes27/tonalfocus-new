/**
 * src/app/api/categories/route.ts
 * ---------------------------------
 * This file defines the API route handler for fetching photography categories.
 * It handles GET requests to '/api/categories' and retrieves data from a Supabase database.
 */
import { NextResponse } from 'next/server'; // Next.js utility for creating API responses.
import { createPublicClient } from '@/lib/supabase-public'; // Cookie-less Supabase client for public data fetching.

/**
 * Handles GET requests to the /api/categories endpoint.
 * Fetches a list of categories from the 'categories' table in Supabase,
 * ordered by 'display_order'.
 *
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 *          On success, it returns a JSON response with the list of categories.
 *          On failure, it returns a JSON response with an error message and a 500 status code.
 */
export async function GET() {
  try {
    // Initialize the Supabase client.
    const supabase = createPublicClient();

    // Fetch data from the 'categories' table.
    // Selects all columns ('*').
    // Orders the results by the 'display_order' column in ascending order.
    const { data, error } = await supabase
      .from('categories') // Specifies the table to query.
      .select('*') // Selects all columns from the table.
      .order('display_order', { ascending: true }); // Orders the results.

    // Handle potential errors from the Supabase query.
    if (error) {
      console.error('Error fetching categories:', error); // Log the Supabase-specific error.
      return NextResponse.json(
        { error: error.message }, // Return the error message from Supabase.
        { status: 500 } // Set HTTP status to 500 (Internal Server Error).
      );
    }

    // If the query is successful, return the fetched categories.
    // `data` will be an array of category objects, or null if no data.
    // Defaults to an empty array if `data` is null or undefined.
    return NextResponse.json({ categories: data || [] });
  } catch (error) {
    // Catch any unexpected errors that occur during the try block.
    console.error('Unexpected error in GET /api/categories:', error); // Log the unexpected error.
    return NextResponse.json(
      { error: 'Internal server error' }, // Return a generic error message.
      { status: 500 } // Set HTTP status to 500.
    );
  }
}

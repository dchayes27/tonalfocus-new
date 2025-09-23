#!/usr/bin/env node

/**
 * Quick health-check for the homepage filmstrip.
 *
 * It ensures we have at least six featured photos in Supabase and that
 * each image URL responds with a 200 so the Next.js image component can load it.
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Default to .env.local so local runs behave like the Next.js app.
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from('photos')
    .select('id, title, public_url, display_order')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(6);

  if (error) {
    throw new Error(`Failed to fetch photos: ${error.message}`);
  }

  if (!data || data.length < 6) {
    throw new Error(`Need at least 6 featured photos. Found ${data ? data.length : 0}.`);
  }

  console.log(`✅ Found ${data.length} featured photos. Checking URLs...`);

  for (const photo of data) {
    const response = await fetch(photo.public_url, { method: 'HEAD' });

    if (!response.ok) {
      throw new Error(`Image ${photo.title} responded with ${response.status}`);
    }

    console.log(`  • ${photo.title} (${photo.public_url}) -> ${response.status}`);
  }

  console.log('\nAll featured photo URLs are returning 200 responses.');
}

main().catch((error) => {
  console.error('Filmstrip check failed:', error.message);
  process.exit(1);
});

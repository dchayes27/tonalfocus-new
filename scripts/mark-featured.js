#!/usr/bin/env node

/**
 * Mark Photos as Featured
 * 
 * Quick utility to mark photos as featured in Supabase
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function markPhotosFeatured() {
  try {
    // Get all photos
    const { data: photos, error: fetchError } = await supabase
      .from('photos')
      .select('id, title, is_featured')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    if (!photos || photos.length === 0) {
      console.log('No photos found in database');
      return;
    }

    console.log('\n📸 Current Photos:');
    photos.forEach((photo, index) => {
      const status = photo.is_featured ? '⭐ FEATURED' : '  ';
      console.log(`${index + 1}. ${status} ${photo.title || 'Untitled'} (${photo.id})`);
    });

    console.log('\nOptions:');
    console.log('1. Mark all photos as featured');
    console.log('2. Mark latest 6 photos as featured');
    console.log('3. Mark specific photo as featured (by number)');
    console.log('4. Unmark all as featured');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\nEnter choice (1-4): ', async (choice) => {
      try {
        switch(choice) {
          case '1':
            // Mark all as featured
            const { error: updateAllError } = await supabase
              .from('photos')
              .update({ is_featured: true })
              .match({});
            
            if (updateAllError) throw updateAllError;
            console.log('✅ All photos marked as featured!');
            break;

          case '2':
            // Mark latest 6 as featured
            const photoIds = photos.slice(0, 6).map(p => p.id);
            const { error: update6Error } = await supabase
              .from('photos')
              .update({ is_featured: true })
              .in('id', photoIds);
            
            if (update6Error) throw update6Error;
            console.log('✅ Latest 6 photos marked as featured!');
            break;

          case '3':
            rl.question('Enter photo number: ', async (photoNum) => {
              const index = parseInt(photoNum) - 1;
              if (index >= 0 && index < photos.length) {
                const { error: updateOneError } = await supabase
                  .from('photos')
                  .update({ is_featured: true })
                  .eq('id', photos[index].id);
                
                if (updateOneError) throw updateOneError;
                console.log(`✅ Photo "${photos[index].title}" marked as featured!`);
              } else {
                console.log('Invalid photo number');
              }
              rl.close();
            });
            return;

          case '4':
            // Unmark all
            const { error: unmarkError } = await supabase
              .from('photos')
              .update({ is_featured: false })
              .match({});
            
            if (unmarkError) throw unmarkError;
            console.log('✅ All photos unmarked as featured');
            break;

          default:
            console.log('Invalid choice');
        }
        rl.close();
      } catch (error) {
        console.error('Error:', error.message);
        rl.close();
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

markPhotosFeatured();

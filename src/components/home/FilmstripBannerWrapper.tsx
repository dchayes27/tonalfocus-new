import FilmstripBanner from './FilmstripBanner';
import { createPublicClient } from '@/lib/supabase-public';

function buildIntroLine(photos: any[]): string | undefined {
  if (!photos || photos.length === 0) return undefined;
  const leading = photos[0];
  const category = leading?.category?.name;
  const title = leading?.title;
  const count = photos.length;

  if (category && title) {
    return `${category.toUpperCase()} · Now playing: ${title}`;
  }

  if (title) {
    return `${count} featured frames · ${title}`;
  }

  return `${count} featured frames from the Tonal Focus archive.`;
}

export default async function FilmstripBannerWrapper() {
  try {
    const supabase = createPublicClient();

    // Fetch featured photos for the filmstrip
    const { data: photos, error } = await supabase
      .from('photos')
      .select(`*, category:categories(name)`) 
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(6);

    if (error) {
      console.error('Error fetching featured photos:', error);
      // Return empty array to show placeholder
      return <FilmstripBanner photos={[]} />;
    }

    // If no featured photos, try to get the latest 6 photos
    if (!photos || photos.length === 0) {
      const { data: latestPhotos, error: latestError } = await supabase
        .from('photos')
        .select('*, category:categories(name)')
        .order('created_at', { ascending: false })
        .limit(6);

      if (latestError) {
        console.error('Error fetching latest photos:', latestError);
        return <FilmstripBanner photos={[]} />;
      }

      return <FilmstripBanner photos={latestPhotos || []} introLine={buildIntroLine(latestPhotos || [])} />;
    }

    return <FilmstripBanner photos={photos} introLine={buildIntroLine(photos)} />;
  } catch (error) {
    console.error('Error in FilmstripBannerWrapper:', error);
    // Return empty array on any error
    return <FilmstripBanner photos={[]} />;
  }
}

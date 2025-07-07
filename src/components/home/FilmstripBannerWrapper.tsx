import FilmstripBanner from './FilmstripBanner';
import { createClient } from '@/lib/supabase-server';

export default async function FilmstripBannerWrapper() {
  try {
    const supabase = createClient();

    // Fetch featured photos for the filmstrip
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
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
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (latestError) {
        console.error('Error fetching latest photos:', latestError);
        return <FilmstripBanner photos={[]} />;
      }

      return <FilmstripBanner photos={latestPhotos || []} />;
    }

    return <FilmstripBanner photos={photos} />;
  } catch (error) {
    console.error('Error in FilmstripBannerWrapper:', error);
    // Return empty array on any error
    return <FilmstripBanner photos={[]} />;
  }
}

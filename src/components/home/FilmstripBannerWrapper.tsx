import FilmstripBanner from './FilmstripBanner';
import { createServerClient } from '@/lib/supabase-server';

export default async function FilmstripBannerWrapper() {
  const supabase = createServerClient();

  // Fetch featured photos for the filmstrip
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(6);

  // If no featured photos, get the latest 6 photos
  const displayPhotos = photos && photos.length > 0 
    ? photos 
    : (await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)).data || [];

  return <FilmstripBanner photos={displayPhotos} />;
}

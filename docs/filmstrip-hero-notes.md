# Filmstrip Hero Tuning Notes

## September 28, 2025

Goal was to satisfy Lighthouse's `uses-responsive-images` audit while preserving the tonal richness of the filmstrip hero.

### Runs

| Attempt | Details | Lighthouse `uses-responsive-images` | LCP |
| ------- | ------- | ------------------------------------ | --- |
| Baseline (full-res Supabase assets) | `src` uses `public_url` originals, frame width `min(820px, 65vw)` | `0` (Est savings ~210 KiB) | 3.3 s |
| Thumbnail-only (Supabase 1200px derivatives) | Force `thumbnail_url` for hero frames, widen deviceSizes granularity | `0` (Est savings ~210 KiB) | 6.2 s |
| Lazy load additional frames, narrower mobile width | Limit initial render to first two frames, shrink mobile width to 70vw | `0` (Est savings ~384 KiB) | 5.8 s |

Latest JSON snapshot lives at `docs/lighthouse/homepage-mobile-2025-09-28-fullres.json`.

### Takeaways

- Next/Image continues to request 640+/768px variants on high-DPR phones even when the rendered width is closer to 200–300px, so the audit still flags "wasted" bytes.
- Using Supabase thumbnails (1200px) keeps visible tonality but does not escape the audit because DPR logic still upscales.
- Aggressively shrinking the hero (70vw) degrades the look without reducing audit noise.

### Next Steps

- Investigate a custom image loader that serves DPR-specific crops (via Edge Function or Next route using Sharp) so we can send ~600px assets to mobile without using Supabase `render/image` (which currently 403s).
- Alternatively, accept the trade-off (tonal fidelity over audit score) and track future work in the pipeline project.

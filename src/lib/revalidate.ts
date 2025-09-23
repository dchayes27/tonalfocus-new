import { revalidatePath } from 'next/cache';

const DEFAULT_PATHS = ['/', '/portfolio'];

export function triggerRevalidation(paths: string[] = DEFAULT_PATHS) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

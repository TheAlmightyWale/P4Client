/**
 * Shortens an array of file paths to the minimum unique suffix.
 *
 * For unique filenames, returns just the filename.
 * For duplicates, incrementally adds parent directory segments until distinct.
 * Uses forward slashes for splitting (depot paths use `/`).
 */
export function shortenPaths(paths: string[]): string[] {
  if (paths.length === 0) return [];

  const parts = paths.map((p) => p.split("/"));

  // Start with just the filename (last segment)
  const shortened = parts.map((segs) => segs[segs.length - 1]);

  // Iteratively add parent segments to resolve duplicates
  const maxDepth = Math.max(...parts.map((p) => p.length));
  for (let depth = 2; depth <= maxDepth; depth++) {
    // Find indices that still have duplicates
    const countMap = new Map<string, number[]>();
    for (let i = 0; i < shortened.length; i++) {
      const key = shortened[i];
      if (!countMap.has(key)) countMap.set(key, []);
      countMap.get(key)!.push(i);
    }

    let anyDuplicates = false;
    for (const [, indices] of countMap) {
      if (indices.length > 1) {
        anyDuplicates = true;
        for (const idx of indices) {
          const segs = parts[idx];
          const start = Math.max(0, segs.length - depth);
          shortened[idx] = segs.slice(start).join("/");
        }
      }
    }

    if (!anyDuplicates) break;
  }

  return shortened;
}

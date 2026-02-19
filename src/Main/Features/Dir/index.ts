import { fdir } from "fdir";
import path from "path";
import type { DirEntry, DirResult, DirListOptions } from "../../../shared/types/dir";
import { DIR_FETCH_DEPTH } from "../../../shared/types/dir";
import { executeP4Command } from "../P4/providers/cli/executor";
import { parseZtagOutput } from "../P4/providers/cli/parser";

/**
 * Gets the workspace root from the current P4 client configuration.
 * Uses `p4 info` to retrieve the clientRoot field.
 */
export async function getWorkspaceRoot(): Promise<DirResult<string>> {
  try {
    const { stdout } = await executeP4Command("info");
    const records = parseZtagOutput(stdout);
    const clientRoot = records[0]?.clientRoot;

    if (!clientRoot) {
      return { success: false, error: "No workspace root found. Is a P4 client configured?" };
    }

    return { success: true, data: clientRoot };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get workspace root",
    };
  }
}

/**
 * Builds a tree of DirEntry objects from a flat list of absolute paths.
 * Groups each path under its parent directory, recursively.
 */
function buildTree(rootPath: string, flatPaths: string[]): DirEntry[] {
  const resolvedRoot = path.resolve(rootPath);

  // Normalize and filter out the root itself
  const resolved = flatPaths
    .map((p) => path.resolve(p))
    .filter((p) => p !== resolvedRoot);

  // Group paths by their immediate parent
  const childrenByParent = new Map<string, string[]>();
  for (const p of resolved) {
    const parent = path.resolve(path.dirname(p));
    if (!childrenByParent.has(parent)) {
      childrenByParent.set(parent, []);
    }
    childrenByParent.get(parent)!.push(p);
  }

  // Recursively build DirEntry tree from a given parent
  function buildEntries(parentPath: string): DirEntry[] {
    const childPaths = childrenByParent.get(path.resolve(parentPath)) || [];
    return childPaths
      .map((p) => {
        const children = buildEntries(p);
        const entry: DirEntry = {
          name: path.basename(p),
          path: p,
        };
        if (children.length > 0) {
          entry.children = children;
        } else if (childrenByParent.has(path.resolve(p))) {
          // fdir visited this dir and found nothing — confirmed empty
          entry.children = [];
        }
        // else: children is undefined → at max depth boundary, not yet fetched
        return entry;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return buildEntries(rootPath);
}

async function addFiles(directory: DirEntry)
{
  const fileApi = new fdir()
    .withMaxDepth(0)
    .crawl(directory.path);

  const files = await fileApi.withPromise();
  files.forEach((f) => {
    if(!directory.files){
      directory.files = [];
    }

    directory.files?.push(f);
  });

  //for child directories
  if(directory.children){
    const filePromises = directory.children.map(addFiles);
    await Promise.all(filePromises);
  }
}

/**
 * Lists child directories of the given path using fdir, up to `depth` levels deep.
 * Returns a tree-structured response: each DirEntry may contain pre-fetched `children`.
 */
export async function listDirectories(options: DirListOptions): Promise<DirResult<DirEntry>> {
  const depth = options.depth ?? DIR_FETCH_DEPTH;

  try {
    const directoryApi = new fdir()
      .withMaxDepth(depth - 1)
      .onlyDirs()
      .crawl(options.path);

    //special case for root entry
    const root: DirEntry = {
      name: path.basename(options.path),
      path: options.path,
    };

    await addFiles(root);

    const flatPaths = await directoryApi.withPromise();
    const entries = buildTree(options.path, flatPaths);

    //Fill all entries with files
    const filePromises = entries.map(addFiles);
    await Promise.all(filePromises);

    root.children = entries;

    return { success: true, data: root };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list directories",
    };
  }
}

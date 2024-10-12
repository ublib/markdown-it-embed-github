import type { Options } from ".";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { XMLHttpRequest } from "xmlhttprequest";

const DEFAULT_CACHE_FILE = "./markdown-it-github.cache.json";

/** url(string) - content(string) */
type Cache = Record<string, string>;
let cache: Cache;

export function fetchHtmlSync(url: string, options?: Options): string {
  const cacheFilePath = options?.cacheFilePath ?? DEFAULT_CACHE_FILE;

  if (!cache) {
    cache = JSON.parse(
      (() => {
        try {
          mkdirSync(dirname(cacheFilePath), { recursive: true });
          return readFileSync(cacheFilePath, "utf-8");
        }
        catch {
          return "{}";
        }
      })(),
    );
  }

  const c = cache[url];
  if (c) {
    return c;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false, undefined, undefined);
  xhr.send(undefined);

  const res = xhr.responseText;
  cache[url] = res;
  writeFileSync(cacheFilePath, JSON.stringify(cache));
  return xhr.responseText;
}

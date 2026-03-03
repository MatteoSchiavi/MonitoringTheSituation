type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

export class APICache {
  private static instance: APICache;
  private cache: Map<string, CacheEntry<any>> = new Map();

  private constructor() { }

  static getInstance(): APICache {
    if (!APICache.instance) {
      APICache.instance = new APICache();
    }
    return APICache.instance;
  }

  async fetch<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cached.ttl) {
      console.log(`[Cache Hit] ${key}`);
      return cached.data;
    }

    console.log(`[Cache Miss] ${key}`);
    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now, ttl });
    return data;
  }

  get<T>(key: string): T | undefined {
    const cached = this.cache.get(key);
    const now = Date.now();
    if (cached && (now - cached.timestamp) < cached.ttl) return cached.data;
    return undefined;
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = APICache.getInstance();
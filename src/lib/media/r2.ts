/** Minimal R2 types for media storage (no @cloudflare/workers-types dependency). */

export interface R2HTTPMetadata {
  contentType?: string;
}

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2Object {
  key: string;
  size: number;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface R2ListedObject {
  key: string;
  size: number;
  uploaded: Date;
}

export interface R2Objects {
  objects: R2ListedObject[];
  truncated: boolean;
  cursor?: string;
}

export interface R2ListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

export interface R2Bucket {
  put(key: string, value: ArrayBuffer | ReadableStream | string, options?: R2PutOptions): Promise<R2Object | null>;
  get(key: string): Promise<R2ObjectBody | null>;
  head(key: string): Promise<R2Object | null>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
}

/** Cloudflare Pages / Workers runtime binding (development). */
export interface StarLocalMediaEnv {
  MEDIA: R2Bucket;
}

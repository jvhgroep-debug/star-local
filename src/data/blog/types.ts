import type { FAQ } from '../services';

export interface BlogPostMeta {
  slug: string;
  title: string;
  h1: string;
  excerpt: string;
  category: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  seoTitle: string;
  seoDescription: string;
  ogDescription: string;
  canonicalPath: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorBio: string;
  faqs: FAQ[];
}

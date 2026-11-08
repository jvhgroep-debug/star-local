import type { FAQ } from '../services';

export interface BlogPostMeta {
  slotKey?: string;
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
  displayTimezone?: string;
  updatedAt: string;
  author: string;
  authorBio: string;
  faqs: FAQ[];
  bodyHtml?: string;
  municipality?: string;
  imageCaption?: string;
  imageSource?: string;
}

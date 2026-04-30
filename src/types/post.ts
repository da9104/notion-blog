export interface ProcessedPost {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  date?: string;
  tags: Array<{ id: string; name: string }>;
  description?: string;
  featured?: boolean;
}

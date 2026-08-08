export type ServiceCategory = 
  | 'todos'
  | 'web-apps'
  | 'e-commerce'
  | 'ui-ux'
  | 'performance-seo'
  | 'mobile-pwa';

export interface ClientTestimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  companyLogoUrl?: string;
  avatarUrl: string;
  rating: number; // 1 to 5
  date: string; // YYYY-MM-DD
  category: ServiceCategory;
  categoryLabel: string;
  projectTitle: string;
  comment: string;
  impactMetric?: string; // e.g., "+180% taxa de conversão"
  tags: string[]; // e.g. ["React", "TypeScript", "Tailwind CSS"]
  verified: boolean;
  likesCount: number;
  userLiked?: boolean;
  featured?: boolean;
  location?: string;
}

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  satisfactionRate: number; // percentage
  onTimeRate: number; // percentage
  recommendationRate: number; // percentage
}

export type SortOption = 'recent' | 'rating-high' | 'likes';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

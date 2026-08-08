import { ClientTestimonial } from '../types';
import { INITIAL_TESTIMONIALS } from '../data/testimonials';

const STORAGE_KEY = 'arnol_portfolio_testimonials_v1';
const LIKED_KEY = 'arnol_portfolio_liked_ids';

export function getStoredTestimonials(): ClientTestimonial[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TESTIMONIALS));
      return INITIAL_TESTIMONIALS;
    }
    const parsed = JSON.parse(data) as ClientTestimonial[];
    const likedIds = getLikedIds();
    return parsed.map(item => ({
      ...item,
      userLiked: likedIds.includes(item.id)
    }));
  } catch (err) {
    console.error('Failed to parse testimonials from localStorage:', err);
    return INITIAL_TESTIMONIALS;
  }
}

export function saveStoredTestimonials(items: ClientTestimonial[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save testimonials:', err);
  }
}

export function getLikedIds(): string[] {
  try {
    const data = localStorage.getItem(LIKED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleLikeTestimonial(id: string): { testimonials: ClientTestimonial[]; liked: boolean } {
  const testimonials = getStoredTestimonials();
  let likedIds = getLikedIds();
  const index = testimonials.findIndex(t => t.id === id);
  
  let isNowLiked = false;
  if (index !== -1) {
    if (likedIds.includes(id)) {
      likedIds = likedIds.filter(i => i !== id);
      testimonials[index].likesCount = Math.max(0, testimonials[index].likesCount - 1);
      testimonials[index].userLiked = false;
      isNowLiked = false;
    } else {
      likedIds.push(id);
      testimonials[index].likesCount += 1;
      testimonials[index].userLiked = true;
      isNowLiked = true;
    }
    localStorage.setItem(LIKED_KEY, JSON.stringify(likedIds));
    saveStoredTestimonials(testimonials);
  }
  return { testimonials, liked: isNowLiked };
}

export function addTestimonial(newTestimonial: Omit<ClientTestimonial, 'id' | 'likesCount' | 'verified' | 'date'>): ClientTestimonial[] {
  const existing = getStoredTestimonials();
  const created: ClientTestimonial = {
    ...newTestimonial,
    id: `test-user-${Date.now()}`,
    likesCount: 0,
    verified: true,
    userLiked: false,
    date: new Date().toISOString().split('T')[0]
  };
  const updated = [created, ...existing];
  saveStoredTestimonials(updated);
  return updated;
}

// Type definitions for TaleWeaver AI Backend

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionPlan: 'SPROUT' | 'DREAMER' | 'FAMILY';
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface StoryBook {
  id: string;
  title: string;
  pages: StoryPage[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  owner?: User;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: Date;
  storyId: string;
  story?: StoryBook;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StoryGenerationRequest {
  prompt: string;
  interests?: string;
  age: number;
}

export interface ChatbotRequest {
  query: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    subscriptionPlan: string;
  };
}

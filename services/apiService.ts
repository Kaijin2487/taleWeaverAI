// Backend API service for TaleWeaver AI Frontend
const API_BASE_URL = 'http://localhost:3001/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: 'SPROUT' | 'DREAMER' | 'FAMILY';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface StoryGenerationRequest {
  prompt: string;
  interests?: string;
  age: number;
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
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

export interface StoryResponse {
  success: boolean;
  storybook: StoryBook;
}

export interface PublicStoriesResponse {
  success: boolean;
  stories: StoryBook[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStories: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
  storyId: string;
}

export interface ChatbotResponse {
  success: boolean;
  response: string;
  timestamp: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Authentication API calls
export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    // Store token in localStorage
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    return apiRequest<{ success: boolean; user: User }>('/auth/me');
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Story API calls
export const storyAPI = {
  generate: async (
    prompt: string,
    interests: string,
    age: number,
    onProgress?: (progress: number, message: string) => void
  ): Promise<StoryBook> => {
    if (onProgress) {
      onProgress(10, 'Crafting your unique story...');
    }

    const response = await apiRequest<StoryResponse>('/stories/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, interests, age }),
    });

    if (onProgress) {
      onProgress(100, 'Your storybook is ready!');
    }

    return response.storybook;
  },

  getMine: async (): Promise<StoryBook[]> => {
    const response = await apiRequest<{ success: boolean; stories: StoryBook[] }>('/stories/mine');
    return response.stories;
  },

  getById: async (storyId: string): Promise<StoryBook> => {
    const response = await apiRequest<{ success: boolean; story: StoryBook }>(`/stories/${storyId}`);
    return response.story;
  },

  share: async (storyId: string): Promise<StoryBook> => {
    const response = await apiRequest<StoryResponse>(`/stories/${storyId}/share`, {
      method: 'PUT',
    });
    return response.storybook;
  },

  unshare: async (storyId: string): Promise<StoryBook> => {
    const response = await apiRequest<StoryResponse>(`/stories/${storyId}/unshare`, {
      method: 'PUT',
    });
    return response.storybook;
  },

  delete: async (storyId: string): Promise<void> => {
    await apiRequest(`/stories/${storyId}`, {
      method: 'DELETE',
    });
  }
};

// Public API calls
export const publicAPI = {
  getStories: async (page: number = 1, limit: number = 12): Promise<PublicStoriesResponse> => {
    return apiRequest<PublicStoriesResponse>(`/public/stories?page=${page}&limit=${limit}`);
  },

  getStoryById: async (storyId: string): Promise<StoryBook> => {
    const response = await apiRequest<{ success: boolean; story: StoryBook }>(`/public/stories/${storyId}`);
    return response.story;
  },

  searchStories: async (query: string, page: number = 1, limit: number = 12): Promise<PublicStoriesResponse> => {
    return apiRequest<PublicStoriesResponse>(`/public/stories/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  addComment: async (storyId: string, name: string, text: string): Promise<Comment> => {
    const response = await apiRequest<{ success: boolean; comment: Comment }>(`/public/stories/${storyId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ name, text }),
    });
    return response.comment;
  },

  getComments: async (storyId: string, page: number = 1, limit: number = 20): Promise<{ comments: Comment[]; pagination: any }> => {
    const response = await apiRequest<{ success: boolean; comments: Comment[]; pagination: any }>(`/public/stories/${storyId}/comments?page=${page}&limit=${limit}`);
    return { comments: response.comments, pagination: response.pagination };
  }
};

// Chatbot API calls
export const chatbotAPI = {
  getResponse: async (query: string): Promise<string> => {
    const response = await apiRequest<ChatbotResponse>('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    return response.response;
  }
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string; environment: string }> => {
  return apiRequest<{ status: string; timestamp: string; environment: string }>('/../health');
};

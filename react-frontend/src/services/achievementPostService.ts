import axios from 'axios';
import { AchievementPost, AchievementPostRequest, CommentRequest } from '../types/achievementPost';

const API_URL = '/api/achievement-posts';

interface AchievementPost {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    user: {
        id: number;
        username: string;
    };
}

interface CreatePostRequest {
    title: string;
    description: string;
    imageUrl: string;
}

interface UpdatePostRequest {
    title?: string;
    description?: string;
    imageUrl?: string;
}

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 401) {
                throw new Error('Unauthorized access. Please login again.');
            } else if (error.response.status === 404) {
                throw new Error('Resource not found.');
            } else if (error.response.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server. Please check your connection.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error setting up request: ' + error.message);
        }
        return Promise.reject(error);
    }
);

export const achievementPostService = {
    async checkConnection(): Promise<boolean> {
        try {
            const response = await api.get('/v1/health');
            return response.data.status === 'UP';
        } catch (error) {
            console.error('Error checking connection:', error);
            return false;
        }
    },

    // Get all achievement posts
    async getAllPosts(): Promise<AchievementPost[]> {
        try {
            const response = await api.get('/achievement-posts');
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    // Get a specific post
    async getPostById(id: number): Promise<AchievementPost> {
        try {
            const response = await api.get(`/achievement-posts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            throw error;
        }
    },

    // Create a new post
    async createPost(postData: AchievementPostRequest, token: string): Promise<AchievementPost> {
        try {
            const response = await api.post('/achievement-posts', postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // Update a post
    async updatePost(id: number, postData: Partial<AchievementPostRequest>, token: string): Promise<AchievementPost> {
        try {
            const response = await api.put(`/achievement-posts/${id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating post ${id}:`, error);
            throw error;
        }
    },

    // Delete a post
    async deletePost(id: number, token: string): Promise<void> {
        try {
            await api.delete(`/achievement-posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(`Error deleting post ${id}:`, error);
            throw error;
        }
    },

    // Like a post
    async likePost(postId: string, token: string): Promise<AchievementPost> {
        try {
            const response = await api.post(`/achievement-posts/${postId}/like`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error liking post ${postId}:`, error);
            throw error;
        }
    },

    // Unlike a post
    async unlikePost(postId: string, token: string): Promise<AchievementPost> {
        try {
            const response = await api.delete(`/achievement-posts/${postId}/like`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error unliking post ${postId}:`, error);
            throw error;
        }
    },

    // Add a comment
    async addComment(postId: string, comment: CommentRequest, token: string): Promise<AchievementPost> {
        const response = await api.post(`/v1/achievement-posts/${postId}/comments`, comment, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return response.data;
    },

    // Delete a comment
    async deleteComment(postId: string, commentId: string, token: string): Promise<AchievementPost> {
        const response = await api.delete(`/v1/achievement-posts/${postId}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete comment');
        return response.data;
    },

    // Get user's posts
    async getUserPosts(userId: string): Promise<AchievementPost[]> {
        const response = await api.get(`/v1/achievement-posts/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user posts');
        return response.data;
    },

    // Get current user's posts
    async getCurrentUserPosts(token: string): Promise<AchievementPost[]> {
        const response = await api.get('/v1/achievement-posts/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch current user posts');
        return response.data;
    },

    // Get feed
    async getFeed(token: string): Promise<AchievementPost[]> {
        const response = await api.get('/v1/achievement-posts/feed', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch feed');
        return response.data;
    },

    // Get liked posts
    async getLikedPosts(token: string): Promise<AchievementPost[]> {
        const response = await api.get('/v1/achievement-posts/liked', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch liked posts');
        return response.data;
    }
}; 
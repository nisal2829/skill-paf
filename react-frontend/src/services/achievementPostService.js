import { AchievementPost, AchievementPostRequest, CommentRequest } from '../types/achievementPost';

const API_URL = 'http://localhost:8081/api/v1';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const checkConnection = async () => {
    try {
        const response = await fetch(`${API_URL}/health`, {
            method: 'GET',
            headers: defaultHeaders,
            credentials: 'include',
            mode: 'cors'
        });
        return response.ok;
    } catch (error) {
        console.error('Backend connection error:', error);
        return false;
    }
};

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: defaultHeaders,
                credentials: 'include',
                mode: 'cors'
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            return response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

export const achievementPostService = {
    // Get all achievement posts
    getAllPosts: async () => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts`, { method: 'GET' });
        } catch (error) {
            console.error('Error in getAllPosts:', error);
            throw error;
        }
    },

    // Get a specific post
    getPostById: async (id) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts/${id}`, { method: 'GET' });
        } catch (error) {
            console.error('Error in getPostById:', error);
            throw error;
        }
    },

    // Create a new post
    createPost: async (postData) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts`, {
                method: 'POST',
                body: JSON.stringify(postData)
            });
        } catch (error) {
            console.error('Error in createPost:', error);
            throw error;
        }
    },

    // Update a post
    updatePost: async (id, postData) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(postData)
            });
        } catch (error) {
            console.error('Error in updatePost:', error);
            throw error;
        }
    },

    // Delete a post
    deletePost: async (id) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            await fetchWithRetry(`${API_URL}/achievement-posts/${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Error in deletePost:', error);
            throw error;
        }
    },

    // Like a post
    likePost: async (id) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts/${id}/like`, { method: 'POST' });
        } catch (error) {
            console.error('Error in likePost:', error);
            throw error;
        }
    },

    // Unlike a post
    unlikePost: async (id) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts/${id}/like`, { method: 'DELETE' });
        } catch (error) {
            console.error('Error in unlikePost:', error);
            throw error;
        }
    },

    // Add a comment to a post
    addComment: async (postId, commentData) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            return await fetchWithRetry(`${API_URL}/achievement-posts/${postId}/comments`, {
                method: 'POST',
                body: JSON.stringify(commentData)
            });
        } catch (error) {
            console.error('Error in addComment:', error);
            throw error;
        }
    },

    // Delete a comment from a post
    deleteComment: async (postId, commentId) => {
        try {
            const isConnected = await checkConnection();
            if (!isConnected) {
                throw new Error('Backend server is not running. Please start the server and try again.');
            }
            await fetchWithRetry(`${API_URL}/achievement-posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Error in deleteComment:', error);
            throw error;
        }
    },

    // Get posts by user
    getPostsByUser: async (userId) => {
        const response = await fetch(`${API_URL}/achievement-posts/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user posts');
        return response.json();
    },

    // Get current user's posts
    getCurrentUserPosts: async () => {
        const response = await fetch(`${API_URL}/achievement-posts/me`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch current user posts');
        return response.json();
    },

    // Get feed posts
    getFeed: async () => {
        const response = await fetch(`${API_URL}/achievement-posts/feed`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch feed posts');
        return response.json();
    },

    // Get liked posts
    getLikedPosts: async () => {
        const response = await fetch(`${API_URL}/achievement-posts/liked`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch liked posts');
        return response.json();
    }
}; 
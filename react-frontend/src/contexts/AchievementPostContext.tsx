import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { achievementPostService } from '../services/achievementPostService';

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

interface AchievementPostContextType {
  posts: AchievementPost[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: AchievementPost) => void;
  updatePost: (post: AchievementPost) => void;
  deletePost: (postId: number) => void;
}

const AchievementPostContext = createContext<AchievementPostContextType | undefined>(undefined);

export const useAchievementPosts = () => {
  const context = useContext(AchievementPostContext);
  if (!context) {
    throw new Error('useAchievementPosts must be used within an AchievementPostProvider');
  }
  return context;
};

interface AchievementPostProviderProps {
  children: ReactNode;
}

export const AchievementPostProvider: React.FC<AchievementPostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<AchievementPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await achievementPostService.getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const addPost = (post: AchievementPost) => {
    setPosts(prevPosts => [...prevPosts, post]);
  };

  const updatePost = (updatedPost: AchievementPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const deletePost = (postId: number) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AchievementPostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        addPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </AchievementPostContext.Provider>
  );
}; 
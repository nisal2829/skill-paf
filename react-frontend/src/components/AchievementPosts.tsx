import React from 'react';
import { useAchievementPosts } from '../contexts/AchievementPostContext';
import AchievementPost from './AchievementPost';

const AchievementPosts: React.FC = () => {
  const { posts, loading, error } = useAchievementPosts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new post.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <AchievementPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default AchievementPosts; 
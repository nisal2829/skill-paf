import React from 'react';
import { AchievementPost } from './AchievementPost';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

export const AchievementPostList: React.FC = () => {
    const { posts, loading, error, updatePost, removePost } = useAchievementPosts();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-600">No achievement posts yet</h3>
                <p className="text-gray-500">Be the first to share your achievements!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <AchievementPost
                    key={post.achievementPostId}
                    post={post}
                    onUpdate={updatePost}
                    onDelete={removePost}
                />
            ))}
        </div>
    );
}; 
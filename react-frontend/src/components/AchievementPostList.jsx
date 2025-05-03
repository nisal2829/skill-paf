import React from 'react';
import AchievementPost from './AchievementPost';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

export const AchievementPostList = () => {
    const { posts, loading, error } = useAchievementPosts();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <AchievementPost
                    key={post.achievementPostId || post.postId || post.id}
                    post={post}
                    onUpdate={updatedPost => {
                        // Update logic will be handled by the context
                    }}
                    onDelete={postId => {
                        // Delete logic will be handled by the context
                    }}
                />
            ))}
        </div>
    );
}; 
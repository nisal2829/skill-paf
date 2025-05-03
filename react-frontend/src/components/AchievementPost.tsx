import React, { useState } from 'react';
import { AchievementPost as AchievementPostType, CommentRequest } from '../types/achievementPost';
import { achievementPostService } from '../services/achievementPostService';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

interface AchievementPostProps {
    post: {
        id: number;
        title: string;
        description: string;
        imageUrl: string;
        createdAt: string;
        user: {
            id: number;
            username: string;
        };
    };
}

const AchievementPost: React.FC<AchievementPostProps> = ({ post }) => {
    const navigate = useNavigate();
    const { deletePost } = useAchievementPosts();
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(post.likes.includes(user?.id || ''));
    const [showComments, setShowComments] = useState(false);

    const handleLike = async () => {
        if (!user?.token) return;
        try {
            const updatedPost = await achievementPostService.likePost(post.id, user.token);
            deletePost(post.id);
            setIsLiked(true);
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleUnlike = async () => {
        if (!user?.token) return;
        try {
            const updatedPost = await achievementPostService.unlikePost(post.id, user.token);
            deletePost(post.id);
            setIsLiked(false);
        } catch (error) {
            console.error('Failed to unlike post:', error);
        }
    };

    const handleAddComment = async () => {
        if (!user?.token || !newComment.trim()) return;
        try {
            const commentRequest: CommentRequest = { content: newComment };
            const updatedPost = await achievementPostService.addComment(
                post.id,
                commentRequest,
                user.token
            );
            deletePost(post.id);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!user?.token) return;
        try {
            const updatedPost = await achievementPostService.deleteComment(
                post.id,
                commentId,
                user.token
            );
            deletePost(post.id);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleDelete = async () => {
        if (!user?.token) return;
        try {
            await achievementPostService.deletePost(post.id, user.token);
            deletePost(post.id);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Posted by {post.user.username} {formatDistanceToNow(new Date(post.createdAt))} ago
                    </div>
                    <div className="space-x-2">
                        <Link
                            to={`/achievements/${post.id}/edit`}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementPost; 
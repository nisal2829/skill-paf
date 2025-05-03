import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { achievementPostService } from '../services/achievementPostService';
import { formatDistanceToNow } from 'date-fns';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

const AchievementPost = ({ post }) => {
    const navigate = useNavigate();
    const { deletePost, likePost } = useAchievementPosts();
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPost, setEditedPost] = useState({
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleUpdatePost = async () => {
        try {
            const updatedPost = await achievementPostService.updatePost(post.postId, editedPost);
            // Assuming onUpdate is called elsewhere in the component
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking like
        try {
            await likePost(post.id);
            setIsLiked(true);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async () => {
        try {
            const updatedPost = await achievementPostService.unlikePost(post.achievementPostId);
            // Assuming onUpdate is called elsewhere in the component
        } catch (error) {
            console.error('Failed to unlike post:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const commentRequest = { content: newComment };
            const updatedPost = await achievementPostService.addComment(
                post.achievementPostId,
                commentRequest
            );
            // Assuming onUpdate is called elsewhere in the component
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const updatedPost = await achievementPostService.deleteComment(
                post.achievementPostId,
                commentId
            );
            // Assuming onUpdate is called elsewhere in the component
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(post.id);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handlePostClick = () => {
        // Check if post.id exists, if not use post.achievementPostId
        const postId = post.id || post.achievementPostId;
        if (!postId) {
            console.error('Post ID is missing');
            return;
        }
        navigate(`/post/${postId}`);
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handlePostClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                    <p className="text-gray-600">{post.skill}</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={handleLike}
                        className="text-gray-600 hover:text-blue-500"
                    >
                        {post.likes} Likes
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
            
            <div className="mb-4">
                <h4 className="font-semibold">{post.templateData.title}</h4>
                <p className="text-gray-700">{post.templateData.whatLearned}</p>
            </div>

            <div className="text-sm text-gray-500">
                <p>Next Steps: {post.templateData.nextStep}</p>
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editedPost.title}
                        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Title"
                    />
                    <textarea
                        value={editedPost.description}
                        onChange={(e) => setEditedPost({ ...editedPost, description: e.target.value })}
                        className="w-full p-2 border rounded-lg"
                        placeholder="Description"
                        rows="4"
                    />
                    <div>
                        <input
                            type="url"
                            value={editedPost.imageUrl}
                            onChange={(e) => setEditedPost({ ...editedPost, imageUrl: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Image URL"
                        />
                        {editedPost.imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={editedPost.imageUrl}
                                    alt="Preview"
                                    className="max-w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleUpdatePost}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center mb-4">
                        <button
                            onClick={isLiked ? handleUnlike : handleLike}
                            className={`mr-4 ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                        >
                            {isLiked ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="text-gray-500"
                        >
                            Comments ({post.comments?.length || 0})
                        </button>
                    </div>

                    {showComments && (
                        <div className="mt-4">
                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 p-2 border rounded-l-lg"
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                                >
                                    Post
                                </button>
                            </div>

                            <div className="space-y-4">
                                {post.comments?.map((comment) => (
                                    <div key={comment.commentId} className="flex items-start">
                                        <img
                                            src={comment.profileImageUrl}
                                            alt={comment.authorName}
                                            className="w-8 h-8 rounded-full mr-3"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-gray-100 rounded-lg p-3">
                                                <p className="font-semibold">{comment.authorName}</p>
                                                <p>{comment.content}</p>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {formatDate(comment.createdAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteComment(comment.commentId);
                                            }}
                                            className="text-red-500 hover:text-red-700 ml-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AchievementPost; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { achievementPostService } from '../services/achievementPostService';
import { formatDistanceToNow } from 'date-fns';

export const PostDetails = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await achievementPostService.getPostById(postId);
                setPost(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch post');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

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

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const commentRequest = { content: newComment };
            const updatedPost = await achievementPostService.addComment(postId, commentRequest);
            setPost(updatedPost);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const updatedPost = await achievementPostService.deleteComment(postId, commentId);
            setPost(updatedPost);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleLike = async () => {
        try {
            const updatedPost = await achievementPostService.likePost(postId);
            setPost(updatedPost);
            setIsLiked(true);
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleUnlike = async () => {
        try {
            const updatedPost = await achievementPostService.unlikePost(postId);
            setPost(updatedPost);
            setIsLiked(false);
        } catch (error) {
            console.error('Failed to unlike post:', error);
            alert('Failed to unlike post. Please try again.');
            setIsLiked(true);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                    <img
                        src={post.profileImageUrl}
                        alt={post.authorName}
                        className="w-12 h-12 rounded-full mr-3"
                    />
                    <div>
                        <h3 className="font-semibold text-lg">{post.authorName}</h3>
                        <p className="text-gray-500 text-sm">
                            {formatDate(post.createdAt)}
                        </p>
                    </div>
                    <div className="ml-auto flex space-x-2">
                        <button
                            onClick={() => navigate(`/edit/${postId}`)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Back to Posts
                        </button>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{post.description}</p>

                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full rounded-lg mb-6"
                    />
                )}

                <div className="flex items-center mb-6">
                    <button
                        onClick={isLiked ? handleUnlike : handleLike}
                        className={`mr-4 ${isLiked ? 'text-blue-500' : 'text-gray-500'}`}
                    >
                        {isLiked ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
                    </button>
                    <span className="text-gray-500">
                        Comments ({post.comments?.length || 0})
                    </span>
                </div>

                <div className="mb-6">
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
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 
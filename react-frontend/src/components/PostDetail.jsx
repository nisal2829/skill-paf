import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { achievementPostService } from '../services/achievementPostService';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

export const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { deletePost, likePost } = useAchievementPosts();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await achievementPostService.getPostById(id);
                setPost(data);
                setIsLiked(data.isLiked);
            } catch (err) {
                setError('Failed to load post');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleLike = async () => {
        try {
            await likePost(id);
            setIsLiked(!isLiked);
            setPost(prev => ({
                ...prev,
                likes: isLiked ? prev.likes - 1 : prev.likes + 1
            }));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                navigate('/');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const updatedPost = await achievementPostService.addComment(id, { content: newComment });
            setPost(updatedPost);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!post) return <div className="text-center p-4">Post not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                        <p className="text-gray-600 mb-2">Skill: {post.skill}</p>
                        <p className="text-sm text-gray-500">
                            Posted {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleLike}
                            className={`px-4 py-2 rounded-lg ${isLiked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {isLiked ? 'Unlike' : 'Like'} ({post.likes})
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Delete Post
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{post.templateData.title}</h2>
                    <p className="text-gray-700 mb-4">{post.templateData.whatLearned}</p>
                    
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Resources Used:</h3>
                        <ul className="list-disc list-inside">
                            {post.templateData.resourceUsed.map((resource, index) => (
                                <li key={index} className="text-gray-700">{resource}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Next Steps:</h3>
                        <p className="text-gray-700">{post.templateData.nextStep}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Comments</h3>
                    
                    <div className="mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 border rounded-lg mb-2"
                            rows="3"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Add Comment
                        </button>
                    </div>

                    <div className="space-y-4">
                        {post.comments?.map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{comment.authorName}</p>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { achievementPostService } from '../services/achievementPostService';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

export const EditAchievementPost = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { updatePost } = useAchievementPosts();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skill: '',
        templateType: 'TODAY_I_LEARNED',
        templateData: {
            type: 'TODAY_I_LEARNED',
            title: '',
            topicSkill: '',
            whatLearned: '',
            resourceUsed: [],
            nextStep: ''
        }
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await achievementPostService.getPostById(postId);
                console.log('Fetched post data:', data); // Debug log
                
                // Ensure we have the correct data structure
                const postData = {
                    title: data.title || '',
                    description: data.description || data.templateData?.whatLearned || '',
                    skill: data.skill || data.templateData?.topicSkill || '',
                    templateType: data.templateType || 'TODAY_I_LEARNED',
                    templateData: {
                        type: data.templateType || 'TODAY_I_LEARNED',
                        title: data.templateData?.title || '',
                        topicSkill: data.templateData?.topicSkill || '',
                        whatLearned: data.templateData?.whatLearned || '',
                        resourceUsed: data.templateData?.resourceUsed || [],
                        nextStep: data.templateData?.nextStep || ''
                    }
                };
                
                console.log('Setting form data:', postData); // Debug log
                setFormData(postData);
                setPost(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to fetch post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Form field changed:', name, value); // Debug log
        
        if (name === 'templateType') {
            setFormData(prev => ({
                ...prev,
                templateType: value,
                templateData: {
                    ...prev.templateData,
                    type: value
                }
            }));
        } else if (name.startsWith('templateData.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                templateData: {
                    ...prev.templateData,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData); // Debug log
        
        try {
            const updatedPost = await achievementPostService.updatePost(postId, formData);
            console.log('Updated post response:', updatedPost); // Debug log
            updatePost(postId, updatedPost);
            navigate('/');
        } catch (err) {
            console.error('Error updating post:', err);
            setError('Failed to update post');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Achievement Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                    />
                </div>

                <div>
                    <label htmlFor="skill" className="block text-gray-700 font-medium mb-2">
                        Skill
                    </label>
                    <input
                        type="text"
                        id="skill"
                        name="skill"
                        value={formData.skill}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="templateType" className="block text-gray-700 font-medium mb-2">
                        Template Type
                    </label>
                    <select
                        id="templateType"
                        name="templateType"
                        value={formData.templateType}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="TODAY_I_LEARNED">Today I Learned</option>
                        <option value="COMPLETED_A_TUTORIAL">Completed a Tutorial</option>
                        <option value="WEEKLY_SUMMARY">Weekly Summary</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="templateData.title" className="block text-gray-700 font-medium mb-2">
                        Template Title
                    </label>
                    <input
                        type="text"
                        id="templateData.title"
                        name="templateData.title"
                        value={formData.templateData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="templateData.topicSkill" className="block text-gray-700 font-medium mb-2">
                        Topic Skill
                    </label>
                    <input
                        type="text"
                        id="templateData.topicSkill"
                        name="templateData.topicSkill"
                        value={formData.templateData.topicSkill}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="templateData.whatLearned" className="block text-gray-700 font-medium mb-2">
                        What You Learned
                    </label>
                    <textarea
                        id="templateData.whatLearned"
                        name="templateData.whatLearned"
                        value={formData.templateData.whatLearned}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                    />
                </div>

                <div>
                    <label htmlFor="templateData.nextStep" className="block text-gray-700 font-medium mb-2">
                        Next Steps
                    </label>
                    <input
                        type="text"
                        id="templateData.nextStep"
                        name="templateData.nextStep"
                        value={formData.templateData.nextStep}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-lg"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}; 
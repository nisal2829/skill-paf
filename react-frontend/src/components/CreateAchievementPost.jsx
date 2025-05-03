import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { achievementPostService } from '../services/achievementPostService';
import { useAchievementPosts } from '../contexts/AchievementPostContext';

export const CreateAchievementPost = () => {
    const navigate = useNavigate();
    const { addPost } = useAchievementPosts();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        setIsSubmitting(true);
        setError(null);

        try {
            const newPost = await achievementPostService.createPost(formData);
            addPost(newPost);
            navigate('/');
        } catch (err) {
            setError('Failed to create post');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create Achievement Post</h2>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
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
                        placeholder="Enter post title"
                    />
                </div>

                <div className="mb-4">
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
                        placeholder="Enter skill name"
                    />
                </div>

                <div className="mb-4">
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

                <div className="mb-4">
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
                        placeholder="Enter template title"
                    />
                </div>

                <div className="mb-4">
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
                        placeholder="Enter topic skill"
                    />
                </div>

                <div className="mb-4">
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
                        rows={4}
                        placeholder="Describe what you learned"
                    />
                </div>

                <div className="mb-4">
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
                        placeholder="Enter your next steps"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}; 
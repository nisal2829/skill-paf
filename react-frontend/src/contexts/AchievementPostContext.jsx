import React, { createContext, useContext, useState, useEffect } from 'react';
import { achievementPostService } from '../services/achievementPostService';

const AchievementPostContext = createContext();

export const useAchievementPosts = () => useContext(AchievementPostContext);

export const AchievementPostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshPosts = async () => {
        try {
            setLoading(true);
            const fetchedPosts = await achievementPostService.getAllPosts();
            setPosts(fetchedPosts);
            setError(null);
        } catch (err) {
            setError('Failed to fetch posts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addPost = (post) => {
        setPosts(prevPosts => [post, ...prevPosts]);
    };

    const updatePost = async (postId, updatedPost) => {
        try {
            const updated = await achievementPostService.updatePost(postId, updatedPost);
            setPosts(posts.map(post => 
                post.postId === postId ? updated : post
            ));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const removePost = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.achievementPostId !== postId));
    };

    useEffect(() => {
        refreshPosts();
    }, []);

    const value = {
        posts,
        loading,
        error,
        refreshPosts,
        addPost,
        updatePost,
        removePost
    };

    return (
        <AchievementPostContext.Provider value={value}>
            {children}
        </AchievementPostContext.Provider>
    );
}; 
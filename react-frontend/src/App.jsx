import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AchievementPostProvider } from './contexts/AchievementPostContext';
import { CreateAchievementPost } from './components/CreateAchievementPost';
import { AchievementPostList } from './components/AchievementPostList';
import { EditAchievementPost } from './components/EditAchievementPost';
import { PostDetails } from './components/PostDetails';
import { Link } from 'react-router-dom';
import { PostDetail } from './components/PostDetail';

function App() {
    return (
        <AchievementPostProvider>
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center">
                                <Link to="/" className="text-3xl font-bold text-gray-900">
                                    Achievement Posts
                                </Link>
                                <Link
                                    to="/create"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Create New Post
                                </Link>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <div className="px-4 py-6 sm:px-0">
                                <div className="max-w-2xl mx-auto">
                                    <Routes>
                                        <Route path="/" element={<AchievementPostList />} />
                                        <Route path="/create" element={<CreateAchievementPost />} />
                                        <Route path="/edit/:postId" element={<EditAchievementPost />} />
                                        <Route path="/post/:postId" element={<PostDetails />} />
                                        <Route path="/post/:id" element={<PostDetail />} />
                                    </Routes>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </Router>
        </AchievementPostProvider>
    );
}

export default App; 
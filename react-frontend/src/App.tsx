import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AchievementPostProvider } from './contexts/AchievementPostContext';
import AchievementPosts from './components/AchievementPosts';
import CreateAchievementPost from './components/CreateAchievementPost';
import Header from './components/Header';

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <Router>
      <AchievementPostProvider>
        <div className="min-h-screen bg-gray-100">
          <Header onCreatePost={() => setIsCreateModalOpen(true)} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<AchievementPosts />} />
            </Routes>
            {isCreateModalOpen && (
              <CreateAchievementPost onCancel={() => setIsCreateModalOpen(false)} />
            )}
          </main>
        </div>
      </AchievementPostProvider>
    </Router>
  );
}

export default App;

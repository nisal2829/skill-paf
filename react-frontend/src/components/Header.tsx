import React from 'react';

interface HeaderProps {
  onCreatePost: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreatePost }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Achievement Posts</h1>
          <button
            onClick={onCreatePost}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create New Post
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import DarkModeToggle from './DarkModeToggle';
import UserMenu from './UserMenu';

const Header = ({ user, onLogout, isDarkMode, toggleDarkMode, onUserUpdate }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Wrap title in Link */}
            <Link to="/dashboard" className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              LeetCode Tracker
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <UserMenu 
              user={user} 
              onLogout={onLogout} 
              onUserUpdate={onUserUpdate} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

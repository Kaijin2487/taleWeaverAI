
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenIcon, SparklesIcon } from './icons/Icons';
import { authAPI } from '../services/apiService';
import AuthModal from './AuthModal';

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const activeClass = "text-blue-600";
  const inactiveClass = "text-slate-600 hover:text-blue-600";

  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? activeClass : inactiveClass) + " transition-colors duration-300 font-bold text-lg"}>
      {children}
    </NavLink>
  );
};

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(authAPI.getCurrentUser());

  const handleAuthSuccess = () => {
    setUser(authAPI.getCurrentUser());
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-50 shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, repeatDelay: 5 }}
              >
                <SparklesIcon className="w-10 h-10 text-amber-500" />
              </motion.div>
              <span className="font-display text-3xl font-bold text-blue-600">TaleWeaver AI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/generate">Create</NavItem>
              <NavItem to="/public-stories">Gallery</NavItem>
              <NavItem to="/pricing">Pricing</NavItem>
              <NavItem to="/about">About Us</NavItem>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-semibold">Welcome, {user.name}!</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-slate-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-slate-600 transition-all duration-300"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </nav>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;


import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md bg-white/80 p-8 rounded-2xl shadow-xl border border-white"
      >
        <h2 className="text-3xl font-display font-bold text-center text-slate-800 mb-2">Join the Adventure!</h2>
        <p className="text-center text-slate-600 mb-8">Create an account to save and share your stories.</p>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-lg font-bold text-slate-700 mb-2">Your Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g., Alex"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-bold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-bold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="A strong password"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <div className="text-center pt-4">
            <button type="submit" className="w-full bg-blue-500 text-white font-bold text-lg py-3 px-10 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300">
              Create Account
            </button>
          </div>
          <p className="text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUpPage;

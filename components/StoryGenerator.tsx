
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyAPI, authAPI } from '../services/apiService';
import type { StoryBook } from '../types';
import FlipBookComponent from './FlipBook';
import { SparklesIcon, ShareIcon } from './icons/Icons';
import { Link } from 'react-router-dom';

const StoryGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [interests, setInterests] = useState('');
  const [age, setAge] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<StoryBook | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [isShared, setIsShared] = useState(false);
  
  const handleProgress = useCallback((prog: number, msg: string) => {
    setProgress(prog);
    setProgressMessage(msg);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a story idea.");
      return;
    }

    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      setError("Please log in to generate stories.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStory(null);
    setIsShared(false);
    setProgress(0);
    setProgressMessage('');
    
    try {
      const generatedBook = await storyAPI.generate(prompt, interests, age, handleProgress);
      setStory(generatedBook);
    } catch (err) {
      console.error(err);
      setError("Oh no! Our story-making machine got a little stuck. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!story) return;
    try {
        await storyAPI.share(story.id);
        setIsShared(true);
    } catch (error) {
        console.error("Failed to share story to public gallery", error);
        setError("Could not share the story. Please try again.");
    }
  }

  const handleReset = () => {
    setStory(null);
    setIsShared(false);
    setPrompt('');
    setInterests('');
    setAge(5);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {!story && (
          <motion.div
            initial={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white">
              <h2 className="text-4xl font-display font-bold text-center text-slate-800 mb-2">Let's Create a Story!</h2>
              <p className="text-center text-slate-600 mb-8">Tell us a little about the story you want to create.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-lg font-bold text-slate-700 mb-2">Story Idea</label>
                  <input
                    type="text"
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A brave squirrel who wants to fly to the moon"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="interests" className="block text-lg font-bold text-slate-700 mb-2">What does your child love?</label>
                  <input
                    type="text"
                    id="interests"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., Dinosaurs, magic, and strawberry ice cream"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-lg font-bold text-slate-700 mb-2">Child's Age: <span className="text-blue-500 font-black">{age}</span></label>
                   <input
                    type="range"
                    id="age"
                    min="2"
                    max="10"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
                    className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer range-lg"
                    disabled={isLoading}
                   />
                </div>

                <div className="text-center pt-4">
                  <button type="submit" disabled={isLoading} className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold text-lg py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100">
                    <SparklesIcon className="w-6 h-6" />
                    {isLoading ? 'Weaving your tale...' : 'Generate Story'}
                  </button>
                </div>
              </form>
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
            <div className="w-full bg-gray-200 rounded-full h-4 my-4">
                <motion.div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-4 rounded-full" 
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <p className="text-slate-600 font-semibold">{progressMessage}</p>
        </motion.div>
      )}

      <AnimatePresence>
        {story && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-4xl font-display font-bold text-center text-slate-800 mb-4">{story.title}</h2>
            <FlipBookComponent pages={story.pages} />
            <div className="text-center mt-8 flex flex-wrap justify-center items-center gap-4">
              <button onClick={handleReset} className="inline-flex items-center gap-2 bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-full hover:bg-slate-300 transition-colors">
                Create a New Story
              </button>
              
              {!isShared ? (
                <button onClick={handleShare} className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold py-2 px-6 rounded-full hover:bg-green-200 transition-colors">
                    <ShareIcon className="w-5 h-5" />
                    Share to Public Gallery
                </button>
              ) : (
                <div className="bg-green-100 text-green-800 font-bold py-2 px-6 rounded-full">
                  ✓ Shared! <Link to="/public-stories" className="underline hover:text-green-900">View in Gallery</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryGenerator;

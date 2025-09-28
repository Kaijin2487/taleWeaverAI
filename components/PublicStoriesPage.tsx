
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StoryBook, Comment } from '../types';
import StoryViewerModal from './StoryViewerModal';
import { BookOpenIcon } from './icons/Icons';
import { publicAPI } from '../services/apiService';

const PublicStoriesPage: React.FC = () => {
    const [stories, setStories] = useState<StoryBook[]>([]);
    const [selectedStory, setSelectedStory] = useState<StoryBook | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStories = async () => {
            try {
                setIsLoading(true);
                const response = await publicAPI.getStories();
                setStories(response.stories);
            } catch (err: any) {
                console.error("Failed to load public stories", err);
                setError(err.message || 'Failed to load stories');
            } finally {
                setIsLoading(false);
            }
        };

        loadStories();
    }, []);

    const handleCommentAdded = (updatedStory: StoryBook) => {
        const updatedStories = stories.map(s => s.id === updatedStory.id ? updatedStory : s);
        setStories(updatedStories);
        setSelectedStory(updatedStory); // Keep modal open with new comment
    };

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-5xl font-display font-bold text-slate-800">Community Story Gallery</h1>
                <p className="mt-4 text-xl text-slate-600">Explore magical stories created by our community!</p>
            </div>

            {isLoading ? (
                <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-slate-600">Loading stories...</p>
                </div>
            ) : error ? (
                <div className="text-center py-16 bg-red-50 rounded-2xl">
                    <h2 className="text-2xl font-bold text-red-700">Error Loading Stories</h2>
                    <p className="text-red-500 mt-2">{error}</p>
                </div>
            ) : stories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedStory(story)}
                            className="cursor-pointer group"
                        >
                            <div className="aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                                <img src={story.pages[0]?.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-800 text-center truncate">{story.title}</h3>
                            {story.owner && (
                                <p className="text-sm text-slate-500 text-center">by {story.owner.name}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white/50 rounded-2xl">
                    <BookOpenIcon className="w-24 h-24 mx-auto text-slate-400" />
                    <h2 className="mt-4 text-2xl font-bold text-slate-700">The Gallery is Empty</h2>
                    <p className="text-slate-500 mt-2">No stories have been shared yet. Be the first to create and share one!</p>
                </div>
            )}

            <AnimatePresence>
                {selectedStory && (
                    <StoryViewerModal
                        story={selectedStory}
                        onClose={() => setSelectedStory(null)}
                        onCommentAdded={handleCommentAdded}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PublicStoriesPage;

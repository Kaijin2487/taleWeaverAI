
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { StoryBook, Comment } from '../types';
import FlipBookComponent from './FlipBook';
import { CloseIcon, ChatBubbleIcon, SendIcon } from './icons/Icons';
import { publicAPI } from '../services/apiService';

interface StoryViewerModalProps {
    story: StoryBook;
    onClose: () => void;
    onCommentAdded: (updatedStory: StoryBook) => void;
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ story, onClose, onCommentAdded }) => {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) return;

        try {
            const newComment = await publicAPI.addComment(story.id, name, comment);
            
            const updatedStory = {
                ...story,
                comments: [...(story.comments || []), newComment]
            };
            onCommentAdded(updatedStory);
            setName('');
            setComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            // You could add error handling here
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-slate-50 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-3 right-3 bg-white/50 hover:bg-white rounded-full p-2 z-50 transition-colors">
                    <CloseIcon className="w-6 h-6 text-slate-700"/>
                </button>
                
                <div className="flex-grow overflow-y-auto">
                    <FlipBookComponent pages={story.pages} />
                    
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h2 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-3">
                            <ChatBubbleIcon className="w-8 h-8 text-blue-500" />
                            Feedback & Comments
                        </h2>
                        
                        <div className="mt-6 bg-white/80 rounded-lg p-6 shadow-inner border">
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <h3 className="font-bold text-lg text-slate-700">Leave a Comment</h3>
                                <div>
                                    <input 
                                      type="text" 
                                      placeholder="Your Name" 
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400" 
                                    />
                                </div>
                                <div>
                                    <textarea 
                                      placeholder="Write your comment..." 
                                      rows={3}
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 focus:ring-2 focus:ring-blue-400"
                                    ></textarea>
                                </div>
                                <div className="text-right">
                                    <button type="submit" className="inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-5 rounded-full hover:bg-blue-600 transition-colors disabled:bg-slate-300" disabled={!name.trim() || !comment.trim()}>
                                        <SendIcon className="w-5 h-5" />
                                        Post Comment
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 space-y-6">
                            {(story.comments || []).length === 0 ? (
                                <p className="text-slate-500 text-center py-4">Be the first to leave a comment!</p>
                            ) : (
                                [...story.comments].reverse().map(c => (
                                    <div key={c.id} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-700 text-xl">
                                            {c.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="bg-white/80 p-4 rounded-lg rounded-tl-none flex-grow shadow-sm border">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-slate-800">{c.name}</p>
                                                <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="mt-2 text-slate-600">{c.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StoryViewerModal;

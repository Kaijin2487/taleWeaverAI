
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RocketIcon, MagicWandIcon } from './icons/Icons';

const LandingPage: React.FC = () => {
  return (
    <div className="text-center py-16">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Weave a World of Wonder
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          Turn your ideas into beautifully illustrated storybooks for your child. Just a spark of imagination is all it takes!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <Link
          to="/generate"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xl py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <MagicWandIcon className="w-7 h-7" />
          Start Creating Your Story
        </Link>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <FeatureCard
          title="Personalized Tales"
          description="Craft stories starring your child's favorite things - from brave astronauts to friendly dinosaurs."
          icon={<RocketIcon />}
        />
        <FeatureCard
          title="AI-Powered Illustrations"
          description="Watch your story come to life with unique, whimsical illustrations generated for every page."
          icon={<MagicWandIcon />}
        />
        <FeatureCard
          title="Safe & Sound"
          description="Our AI is trained to create age-appropriate and positive content, ensuring a safe experience for your little one."
          icon={<div className="text-3xl">🛡️</div>}
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
    className="bg-white/60 p-8 rounded-2xl shadow-lg border border-white"
  >
    <div className="text-amber-500 w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-4xl mb-4">
      {icon}
    </div>
    <h3 className="text-2xl font-bold font-display text-slate-800">{title}</h3>
    <p className="mt-2 text-slate-600">{description}</p>
  </motion.div>
);

export default LandingPage;

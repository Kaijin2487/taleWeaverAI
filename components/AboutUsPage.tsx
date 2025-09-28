
import React from 'react';
import { motion } from 'framer-motion';

const AboutUsPage: React.FC = () => {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-display font-bold text-slate-800 text-center">Our Story</h1>
        <p className="mt-4 text-xl text-slate-600 text-center">
          At TaleWeaver AI, we believe in the power of stories to ignite imagination, foster connection, and create lasting memories.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 bg-white/80 p-8 rounded-2xl shadow-lg border border-white space-y-6 text-lg text-slate-700"
      >
        <p>
          We started TaleWeaver AI with a simple mission: to make it easy for parents, grandparents, and caregivers to create unique, personalized stories for the children in their lives. In a world full of passive screen time, we wanted to bring back the magic of reading together, enhanced by the limitless possibilities of modern technology.
        </p>
        <p>
          Our team is a small group of passionate parents, artists, and engineers who understand the importance of safe, positive, and engaging content for kids. We've carefully designed our AI to be a creative partner, helping you weave tales of adventure, friendship, and wonder that are perfectly tailored to your child's age and interests.
        </p>
        <p>
          Every story created on our platform is a testament to the special bond between a storyteller and a child. We're honored to be a small part of your family's story time. Thank you for creating with us!
        </p>
      </motion.div>
    </div>
  );
};

export default AboutUsPage;

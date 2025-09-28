
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white/50 backdrop-blur-sm mt-12 py-6">
      <div className="container mx-auto px-4 text-center text-slate-500">
        <p>&copy; {currentYear} TaleWeaver AI. All rights reserved.</p>
        <p className="text-sm mt-1">Creating magical moments, one story at a time.</p>
      </div>
    </footer>
  );
};

export default Footer;

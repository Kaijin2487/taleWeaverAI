
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import StoryGenerator from './components/StoryGenerator';
import PricingPage from './components/PricingPage';
import AboutUsPage from './components/AboutUsPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PublicStoriesPage from './components/PublicStoriesPage';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 via-rose-50 to-amber-50 text-slate-800">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<StoryGenerator />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/public-stories" element={<PublicStoriesPage />} />
          </Routes>
        </main>
        <Chatbot />
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;

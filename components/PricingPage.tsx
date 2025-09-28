
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from './icons/Icons';

const PricingPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-display font-bold text-slate-800">Choose Your Adventure</h1>
        <p className="mt-4 text-xl text-slate-600">Unlock endless stories and magical moments with our plans.</p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PricingCard
          plan="Sprout"
          price="Free"
          description="A great way to start your storytelling journey."
          features={["3 Stories per month", "Standard Illustrations", "Community Support"]}
          isPopular={false}
        />
        <PricingCard
          plan="Dreamer"
          price="$9"
          perks="/month"
          description="For the avid storyteller and their little listeners."
          features={["Unlimited Stories", "Premium Illustrations", "Save & Share Books", "Priority Support"]}
          isPopular={true}
        />
        <PricingCard
          plan="Family"
          price="$15"
          perks="/month"
          description="Create and share stories with the whole family."
          features={["All Dreamer Features", "Multiple User Profiles", "Early Access to New Features", "Personalized Avatars"]}
          isPopular={false}
        />
      </div>
    </div>
  );
};

interface PricingCardProps {
    plan: string;
    price: string;
    perks?: string;
    description: string;
    features: string[];
    isPopular: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, perks, description, features, isPopular }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className={`relative bg-white/80 p-8 rounded-2xl shadow-lg border ${isPopular ? 'border-blue-500' : 'border-white'}`}
        >
            {isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                </div>
            )}
            <h3 className="text-2xl font-display font-bold text-center text-slate-800">{plan}</h3>
            <p className="mt-2 text-center text-slate-500">{description}</p>
            <div className="mt-8 text-center">
                <span className="text-5xl font-extrabold text-slate-900">{price}</span>
                {perks && <span className="text-lg text-slate-500">{perks}</span>}
            </div>
            <ul className="mt-8 space-y-4">
                {features.map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                    </li>
                ))}
            </ul>
            <button className={`w-full mt-10 font-bold py-3 rounded-lg transition-colors duration-300 ${isPopular ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}>
                Choose Plan
            </button>
        </motion.div>
    );
}

export default PricingPage;

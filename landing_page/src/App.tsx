import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Benefits } from './components/Benefits';
import { Cta } from './components/Cta';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Benefits />
        <Cta />
      </main>
      <Footer />
    </div>
  );
};

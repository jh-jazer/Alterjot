import React from 'react';
import { RankingSection } from './RankingSection';
import { Footer } from '../layout/Footer';

export const RankingView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-canvas text-ink select-none pb-24 md:pb-10">
      <div className="w-full px-4 sm:px-8 md:px-12 py-6 sm:py-10 space-y-6 sm:space-y-10">
        <RankingSection />
      </div>
      <Footer />
    </div>
  );
};

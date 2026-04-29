import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-tech-gray">
      <Sidebar />
      <main className="transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

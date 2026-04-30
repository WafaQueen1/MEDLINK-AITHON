import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-tech-gray overflow-hidden">
      {children}
    </div>
  );
};

export default MainLayout;

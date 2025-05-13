import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogin, onLogout }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header user={user} onLogin={onLogin} onLogout={onLogout} />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CampaignHQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
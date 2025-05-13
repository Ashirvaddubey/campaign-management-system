import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Bell, Menu, User, LogOut, Plus, X } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" onClick={closeAllMenus} className="flex items-center">
                <BarChart2 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CampaignHQ</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/campaigns"
                onClick={closeAllMenus}
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/campaigns'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Campaigns
              </Link>
              <Link
                to="/analytics"
                onClick={closeAllMenus}
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/analytics'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Analytics
              </Link>
              <Link
                to="/audience"
                onClick={closeAllMenus}
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  location.pathname === '/audience'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Audience
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <>
                <Link to="/campaigns/new" className="hidden sm:block mr-4">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Plus size={16} />}
                    onClick={closeAllMenus}
                  >
                    New Campaign
                  </Button>
                </Link>
                
                <button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5"></span>
                  <Bell className="h-6 w-6" />
                  <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                <div className="relative ml-4">
                  <button
                    type="button"
                    className="relative flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={toggleUserMenu}
                  >
                    <span className="absolute -inset-1.5"></span>
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={closeAllMenus}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Your Profile
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          closeAllMenus();
                          onLogout();
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={onLogin}>Sign in</Button>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={toggleMenu}
              >
                <span className="absolute -inset-0.5"></span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <Link
              to="/campaigns"
              onClick={closeAllMenus}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                location.pathname === '/campaigns'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Campaigns
            </Link>
            <Link
              to="/analytics"
              onClick={closeAllMenus}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                location.pathname === '/analytics'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/audience"
              onClick={closeAllMenus}
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                location.pathname === '/audience'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              Audience
            </Link>
            
            {user && (
              <Link
                to="/campaigns/new"
                onClick={closeAllMenus}
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-blue-600 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  New Campaign
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
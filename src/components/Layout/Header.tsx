import React from 'react';
import { useLocation } from 'react-router-dom';
import { FileWarning, ChevronDown, Bell, Settings, Search } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/':
        return 'Dashboard';
      case '/compare':
        return 'Report Comparison';
      case '/history':
        return 'Comparison History';
      case '/settings':
        return 'Settings';
      default:
        return 'Report Discrepancy Analyzer';
    }
  };

  return (
    <header className="border-b border-neutral-200 bg-white py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-neutral-900">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 w-64"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          </div>
          
          <button className="p-2 rounded-full hover:bg-neutral-100 relative">
            <Bell className="h-5 w-5 text-neutral-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500"></span>
          </button>
          
          <button className="p-2 rounded-full hover:bg-neutral-100">
            <Settings className="h-5 w-5 text-neutral-600" />
          </button>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
              JS
            </div>
            <ChevronDown className="ml-1 h-4 w-4 text-neutral-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
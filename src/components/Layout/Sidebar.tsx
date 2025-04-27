import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileDiff, 
  Clock, 
  Settings, 
  FileWarning,
  ChevronLeft
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <motion.aside
      className="bg-white border-r border-neutral-200 flex flex-col h-full relative"
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b border-neutral-200 flex items-center">
        <FileWarning className="h-6 w-6 text-primary-500" />
        {!collapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="ml-2 font-semibold text-lg"
          >
            DiscrepancyAI
          </motion.h1>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <NavItem 
            to="/compare" 
            icon={<FileDiff />}
            label="Compare Reports"
            collapsed={collapsed}
          />
          <NavItem 
            to="/history" 
            icon={<Clock />}
            label="History"
            collapsed={collapsed}
          />
          <NavItem 
            to="/settings" 
            icon={<Settings />}
            label="Settings"
            collapsed={collapsed}
          />
        </ul>
      </nav>
      
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-neutral-200 rounded-full p-1 shadow-sm"
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeft className="h-4 w-4 text-neutral-600" />
        </motion.div>
      </button>
    </motion.aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, collapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => 
          `flex items-center rounded-lg p-3 ${
            isActive 
              ? 'bg-primary-50 text-primary-600' 
              : 'text-neutral-600 hover:bg-neutral-100'
          } transition-colors ${
            collapsed ? 'justify-center' : ''
          }`
        }
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="ml-3 text-sm font-medium"
          >
            {label}
          </motion.span>
        )}
      </NavLink>
    </li>
  );
};

export default Sidebar;
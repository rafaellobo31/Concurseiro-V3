import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, LogOut, User as UserIcon, Menu, X, ClipboardList, History } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Simulados', href: '/simulados', icon: BookOpen },
    { name: 'Histórico', href: '/history', icon: History },
    { name: 'Plano de Estudos', href: '/study-plan', icon: ClipboardList },
    { name: 'Perfil', href: '/profile', icon: UserIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Concurseiro</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-200 mx-2" />
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                <p className="text-[10px] text-gray-500">{user?.email}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3",
                  isActive(item.href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            <button 
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

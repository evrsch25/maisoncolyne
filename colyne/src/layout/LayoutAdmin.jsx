import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Mail
} from 'lucide-react';
import { useState } from 'react';

const LayoutAdmin = () => {
  const { isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { path: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/prestations', label: 'Prestations', icon: FileText },
    { path: '/admin/blog', label: 'Blog', icon: FileText },
    { path: '/admin/portfolio', label: 'Portfolio', icon: Image },
    { path: '/admin/media', label: 'Médias Statiques', icon: Image },
    { path: '/admin/messages', label: 'Messages de contact', icon: Mail },
    { path: '/admin/testimonials', label: 'Témoignages', icon: MessageSquare },
    { path: '/admin/pages', label: 'Pages', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-brown"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-display font-bold text-brown-dark">
              Administration - Colyne Photographe
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-brown transition-colors"
            >
              Voir le site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-beige-light hover:text-brown transition-colors"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default LayoutAdmin;


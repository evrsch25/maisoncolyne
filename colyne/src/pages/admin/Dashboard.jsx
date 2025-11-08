import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import { FileText, Image, MessageSquare, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { prestations, blog, config } = useData();

  const stats = [
    {
      title: 'Prestations',
      value: prestations.length,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/prestations',
    },
    {
      title: 'Articles de blog',
      value: blog.length,
      icon: MessageSquare,
      color: 'bg-green-500',
      link: '/admin/blog',
    },
    {
      title: 'Photos totales',
      value: prestations.reduce((acc, p) => acc + (p.gallery?.length || 0), 0),
      icon: Image,
      color: 'bg-purple-500',
      link: '/admin/prestations',
    },
    {
      title: 'Témoignages',
      value: config.testimonials.length,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/admin/pages',
    },
  ];

  const recentActivities = [
    { action: 'Prestation ajoutée', item: 'Séance Grossesse', date: '2025-03-15' },
    { action: 'Article publié', item: 'Comment préparer sa séance', date: '2025-03-14' },
    { action: 'Page modifiée', item: 'À propos', date: '2025-03-12' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue dans votre espace d'administration
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Activité récente
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-brown rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/prestations"
              className="block w-full px-4 py-3 bg-brown text-white rounded-lg hover:bg-brown-dark transition-colors text-center font-medium"
            >
              Ajouter une prestation
            </Link>
            <Link
              to="/admin/blog"
              className="block w-full px-4 py-3 bg-beige text-brown rounded-lg hover:bg-beige-dark transition-colors text-center font-medium"
            >
              Créer un article
            </Link>
            <Link
              to="/admin/pages"
              className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
            >
              Modifier les pages
            </Link>
            <Link
              to="/"
              target="_blank"
              className="block w-full px-4 py-3 border-2 border-brown text-brown rounded-lg hover:bg-brown hover:text-white transition-all text-center font-medium"
            >
              Aperçu du site
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Prestations Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Prestations populaires
          </h2>
          <Link to="/admin/prestations" className="text-brown hover:text-brown-dark text-sm font-medium">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prestations.slice(0, 3).map((prestation) => (
            <div key={prestation.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{prestation.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prestation.shortDescription}</p>
              <p className="text-brown font-semibold">{prestation.basePrice}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Image, Mail, MessageSquare, Megaphone, Camera,
  ArrowRight, Clock, CheckCircle, AlertCircle, Eye,
  BookOpen, LayoutDashboard, Settings, Star, TrendingUp,
  ExternalLink, Scale
} from 'lucide-react';
import {
  prestationsAPI, blogAPI, portfolioAPI, contactAPI,
  testimonialsAPI, actualitesAPI, mediaStaticAPI
} from '../../utils/api';

const statusConfig = {
  nouveau: { label: 'Nouveau', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  lu: { label: 'Lu', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  traite: { label: 'Traité', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  archive: { label: 'Archivé', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const StatCard = ({ icon: Icon, label, value, color, link, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link
      to={link}
      className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-brown/30 transition-all group"
    >
      <div className={`${color} p-3 rounded-xl`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500 truncate">{label}</p>
      </div>
      <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-brown transition-colors shrink-0" />
    </Link>
  </motion.div>
);

const SectionCard = ({ title, icon: Icon, link, linkLabel, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-brown" />
        <h2 className="font-display font-semibold text-gray-900 text-lg">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="text-sm text-brown hover:text-brown-dark font-medium flex items-center gap-1">
          {linkLabel || 'Voir tout'} <ArrowRight size={14} />
        </Link>
      )}
    </div>
    {children}
  </motion.div>
);

const QuickLink = ({ to, icon: Icon, label, sublabel, color }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-beige-light transition-colors group"
  >
    <div className={`${color} p-2 rounded-lg`}>
      <Icon size={16} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-800 group-hover:text-brown transition-colors">{label}</p>
      {sublabel && <p className="text-xs text-gray-400 truncate">{sublabel}</p>}
    </div>
    <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-brown transition-colors shrink-0" />
  </Link>
);

const Dashboard = () => {
  const [data, setData] = useState({
    prestations: [], blog: [], portfolio: [], contacts: [],
    testimonials: [], actualites: [], media: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        prestationsAPI.getAll(),
        blogAPI.getAll(),
        portfolioAPI.getAll(),
        contactAPI.getAll(),
        testimonialsAPI.getAll(),
        actualitesAPI.getAll(),
        mediaStaticAPI.getAll(),
      ]);
      setData({
        prestations: results[0].value?.data || [],
        blog: results[1].value?.data || [],
        portfolio: results[2].value?.data || [],
        contacts: results[3].value?.data || [],
        testimonials: results[4].value?.data || [],
        actualites: results[5].value?.data || [],
        media: results[6].value?.data || [],
      });
      setLoading(false);
    };
    fetchAll();
  }, []);

  const nouveauxMessages = data.contacts.filter((c) => c.status === 'nouveau').length;
  const articlesPublies = data.blog.filter((a) => a.published !== false).length;
  const photosTotal = data.portfolio.length;
  const photosTitrees = data.portfolio.filter((p) => p.titree).length;
  const actusActives = data.actualites.filter((a) => a.active !== false).length;

  const recentContacts = [...data.contacts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentBlog = [...data.blog]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const recentActualites = [...data.actualites]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const stats = [
    { icon: FileText, label: 'Prestations', value: data.prestations.length, color: 'bg-indigo-500', link: '/admin/prestations', delay: 0 },
    { icon: BookOpen, label: 'Articles publiés', value: loading ? null : articlesPublies, color: 'bg-emerald-500', link: '/admin/blog', delay: 0.05 },
    { icon: Camera, label: 'Photos portfolio', value: loading ? null : photosTotal, color: 'bg-violet-500', link: '/admin/portfolio', delay: 0.1 },
    { icon: Mail, label: nouveauxMessages > 0 ? `${nouveauxMessages} nouveau${nouveauxMessages > 1 ? 'x' : ''}` : 'Messages', value: loading ? null : data.contacts.length, color: nouveauxMessages > 0 ? 'bg-red-500' : 'bg-slate-500', link: '/admin/messages', delay: 0.15 },
    { icon: MessageSquare, label: 'Témoignages', value: loading ? null : data.testimonials.length, color: 'bg-amber-500', link: '/admin/testimonials', delay: 0.2 },
    { icon: Megaphone, label: 'Actualités actives', value: loading ? null : actusActives, color: 'bg-rose-500', link: '/admin/actualites', delay: 0.25 },
  ];

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Bonjour' : now.getHours() < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">
            {greeting} 👋
          </h1>
          <p className="text-gray-500">
            Voici un aperçu de votre espace Maison Colyne.
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 border border-brown text-brown rounded-lg hover:bg-brown hover:text-white transition-all text-sm font-medium"
        >
          <ExternalLink size={15} />
          Voir le site
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Blog + Actualités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers articles */}
        <SectionCard title="Derniers articles" icon={BookOpen} link="/admin/blog" delay={0.4}>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : recentBlog.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4 text-center">Aucun article rédigé pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recentBlog.map((article) => (
                <div key={article._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {article.mainImage ? (
                      <img src={article.mainImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                    <p className="text-xs text-gray-400">{article.category} · {formatDate(article.createdAt)}</p>
                  </div>
                  {article.published === false && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">Brouillon</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Dernières actualités */}
        <SectionCard title="Dernières actualités" icon={Megaphone} link="/admin/actualites" delay={0.45}>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : recentActualites.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-4 text-center">Aucune actualité publiée pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recentActualites.map((actu) => {
                const expired = actu.createdAt && new Date(actu.createdAt) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
                return (
                  <div key={actu._id} className="flex items-start gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${actu.active && !expired ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{actu.title}</p>
                      <p className="text-xs text-gray-400">{actu.category} · {formatDate(actu.createdAt)}</p>
                    </div>
                    {expired && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full shrink-0">Expirée</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Portfolio aperçu */}
      {!loading && data.portfolio.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-brown" />
              <h2 className="font-display font-semibold text-gray-900 text-lg">
                Portfolio — aperçu
              </h2>
            </div>
            <Link to="/admin/portfolio" className="text-sm text-brown hover:text-brown-dark font-medium flex items-center gap-1">
              Gérer <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {data.portfolio.slice(0, 12).map((photo) => (
              <div key={photo._id} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                {photo.imageUrl ? (
                  <img src={photo.imageUrl} alt={photo.alt || ''} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={12} className="text-gray-300" />
                  </div>
                )}
                {photo.titree && (
                  <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-amber-400 rounded-full" title="Photo titrée" />
                )}
              </div>
            ))}
            {data.portfolio.length > 12 && (
              <Link
                to="/admin/portfolio"
                className="aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 hover:border-brown hover:text-brown transition-colors"
              >
                +{data.portfolio.length - 12}
              </Link>
            )}
          </div>
          <div className="mt-3 flex gap-4 text-sm text-gray-500">
            <span><strong className="text-gray-800">{photosTotal}</strong> photos au total</span>
            {photosTitrees > 0 && (
              <span><strong className="text-amber-600">{photosTitrees}</strong> titrées ⭐</span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

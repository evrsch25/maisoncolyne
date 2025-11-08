import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { motion } from 'framer-motion';
import BlogCard from '../../components/BlogCard';
import { Search } from 'lucide-react';

const Blog = () => {
  const { blog } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Extraire les catégories uniques
  const categories = ['all', ...new Set(blog.map(post => post.category))];

  // Filtrer les articles
  const filteredBlog = blog.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="section-padding bg-beige-light">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-dark mb-6">
              Le Blog
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Conseils, inspirations, coulisses de mes séances et actualités. 
              Plongez dans mon univers photographique !
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {/*<section className="py-8 bg-white sticky top-20 z-40 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-brown text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-beige hover:text-brown'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Articles Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {filteredBlog.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-xl text-gray-600">
                Aucun article trouvé. Essayez avec d'autres mots-clés.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlog.map((post) => (
                <BlogCard key={post._id || post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;


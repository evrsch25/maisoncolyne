import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pagesLegalesAPI } from '../../utils/api';

const PageLegaleDynamique = ({ slug, pageTitle }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pagesLegalesAPI.get(slug)
      .then((res) => setPage(res.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="animate-fade-in min-h-screen bg-white py-16">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-display font-bold text-brown-dark mb-8">
            {loading ? pageTitle : (page?.title || pageTitle)}
          </h1>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-lg max-w-none space-y-8">
              {(page?.sections || []).map((section, i) => (
                <section key={i}>
                  {section.heading && (
                    <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                      {section.heading}
                    </h2>
                  )}
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                </section>
              ))}
              {(!page?.sections || page.sections.length === 0) && (
                <p className="text-gray-500 italic">Contenu en cours de rédaction.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageLegaleDynamique;

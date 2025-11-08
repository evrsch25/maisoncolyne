import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import LayoutPublic from './layout/LayoutPublic';
import LayoutAdmin from './layout/LayoutAdmin';

// Pages publiques
import Home from './pages/public/Home';
import Portfolio from './pages/public/Portfolio';
import Prestations from './pages/public/Prestations';
import PrestationDetail from './pages/public/PrestationDetail';
import APropos from './pages/public/APropos';
import Contact from './pages/public/Contact';
import Blog from './pages/public/Blog';
import Article from './pages/public/Article';
import MentionsLegales from './pages/public/MentionsLegales';
import PolitiqueConfidentialite from './pages/public/PolitiqueConfidentialite';
import CGV from './pages/public/CGV';

// Pages admin
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PrestationsAdmin from './pages/admin/PrestationsAdmin';
import BlogAdmin from './pages/admin/BlogAdmin';
import PagesAdmin from './pages/admin/PagesAdmin';
import PortfolioAdmin from './pages/admin/PortfolioAdmin';
import MediaStaticAdmin from './pages/admin/MediaStaticAdmin';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import ContactMessagesAdmin from './pages/admin/ContactMessagesAdmin';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<LayoutPublic />}>
              <Route index element={<Home />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="prestations" element={<Prestations />} />
              <Route path="prestation/:slug" element={<PrestationDetail />} />
              <Route path="a-propos" element={<APropos />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<Article />} />
              <Route path="mentions-legales" element={<MentionsLegales />} />
              <Route path="politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="cgv" element={<CGV />} />
            </Route>

            {/* Route de connexion admin */}
            <Route path="/admin/login" element={<Login />} />

            {/* Routes admin protégées */}
            <Route path="/admin" element={<LayoutAdmin />}>
              <Route index element={<Dashboard />} />
              <Route path="prestations" element={<PrestationsAdmin />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="portfolio" element={<PortfolioAdmin />} />
              <Route path="media" element={<MediaStaticAdmin />} />
              <Route path="testimonials" element={<TestimonialsAdmin />} />
              <Route path="messages" element={<ContactMessagesAdmin />} />
              <Route path="pages" element={<PagesAdmin />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

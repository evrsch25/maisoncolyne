import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NewsPopup from '../components/NewsPopup';

const LayoutPublic = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <NewsPopup />
    </div>
  );
};

export default LayoutPublic;


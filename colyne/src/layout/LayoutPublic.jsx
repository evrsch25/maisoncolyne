import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const LayoutPublic = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-36">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutPublic;


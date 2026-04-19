import { useEffect } from 'react';

const usePageTitle = (pageName) => {
  useEffect(() => {
    document.title = pageName
      ? `Maison Colyne - ${pageName}`
      : 'Maison Colyne';

    return () => {
      document.title = 'Maison Colyne';
    };
  }, [pageName]);
};

export default usePageTitle;

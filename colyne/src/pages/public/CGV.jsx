import usePageTitle from '../../hooks/usePageTitle';
import PageLegaleDynamique from '../../components/PageLegaleDynamique';

const CGV = () => {
  usePageTitle('CGV');
  return <PageLegaleDynamique slug="cgv" pageTitle="Conditions Générales de Vente" />;
};

export default CGV;

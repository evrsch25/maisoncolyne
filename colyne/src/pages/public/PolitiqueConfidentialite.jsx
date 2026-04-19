import usePageTitle from '../../hooks/usePageTitle';
import PageLegaleDynamique from '../../components/PageLegaleDynamique';

const PolitiqueConfidentialite = () => {
  usePageTitle('Politique de confidentialité');
  return <PageLegaleDynamique slug="politique-confidentialite" pageTitle="Politique de Confidentialité" />;
};

export default PolitiqueConfidentialite;

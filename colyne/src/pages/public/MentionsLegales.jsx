import usePageTitle from '../../hooks/usePageTitle';
import PageLegaleDynamique from '../../components/PageLegaleDynamique';

const MentionsLegales = () => {
  usePageTitle('Mentions légales');
  return <PageLegaleDynamique slug="mentions-legales" pageTitle="Mentions Légales" />;
};

export default MentionsLegales;

import { motion } from 'framer-motion';

const MentionsLegales = () => {
  return (
    <div className="animate-fade-in min-h-screen bg-white py-16">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-display font-bold text-brown-dark mb-8">
            Mentions Légales
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Éditeur du site
              </h2>
              <p>
                <strong>Nom :</strong> Colyne Photographe<br />
                <strong>Statut :</strong> Entreprise individuelle<br />
                <strong>Adresse :</strong> Oye-plage, 62215, France<br />
                <strong>Email :</strong> contact@colynephotographe.fr<br />
                <strong>Téléphone :</strong> +33 6 12 34 56 78
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Directeur de publication
              </h2>
              <p>Colyne</p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Hébergement
              </h2>
              <p>
                Ce site est hébergé par :<br />
                [Nom de l'hébergeur]<br />
                [Adresse de l'hébergeur]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Propriété intellectuelle
              </h2>
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
              <p>
                La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est 
                formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Protection des données personnelles
              </h2>
              <p>
                Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement 
                Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification 
                et de suppression des données vous concernant.
              </p>
              <p>
                Pour exercer ce droit, contactez-nous à : contact@colynephotographe.fr
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Cookies
              </h2>
              <p>
                Ce site utilise des cookies uniquement pour améliorer l'expérience utilisateur et mesurer 
                l'audience. Aucune donnée personnelle n'est collectée sans votre consentement.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentionsLegales;


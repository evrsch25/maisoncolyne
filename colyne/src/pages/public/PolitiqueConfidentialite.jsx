import { motion } from 'framer-motion';

const PolitiqueConfidentialite = () => {
  return (
    <div className="animate-fade-in min-h-screen bg-white py-16">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-display font-bold text-brown-dark mb-8">
            Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Collecte des données
              </h2>
              <p>
                Dans le cadre de l'utilisation de notre site, nous sommes susceptibles de collecter 
                les données personnelles suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Informations relatives à votre demande de prestation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Utilisation des données
              </h2>
              <p>
                Vos données personnelles sont collectées uniquement dans le but de :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Répondre à vos demandes de renseignements</li>
                <li>Traiter vos réservations de séances photo</li>
                <li>Vous envoyer des informations sur nos services (si vous y consentez)</li>
                <li>Améliorer la qualité de nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Conservation des données
              </h2>
              <p>
                Vos données personnelles sont conservées pendant la durée nécessaire à la réalisation 
                des finalités mentionnées ci-dessus, et dans le respect des durées légales de conservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Sécurité
              </h2>
              <p>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées 
                afin de garantir la sécurité de vos données personnelles et d'empêcher qu'elles ne soient 
                déformées, endommagées ou que des tiers non autorisés y aient accès.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Vos droits
              </h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d'accès :</strong> Vous pouvez obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
                <li><strong>Droit de rectification :</strong> Vous pouvez demander la rectification de vos données inexactes</li>
                <li><strong>Droit à l'effacement :</strong> Vous pouvez demander l'effacement de vos données</li>
                <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données</li>
                <li><strong>Droit à la portabilité :</strong> Vous pouvez demander à recevoir vos données dans un format structuré</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous à : <strong>contact@colynephotographe.fr</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Contact
              </h2>
              <p>
                Pour toute question relative à cette politique de confidentialité ou à la gestion 
                de vos données personnelles, vous pouvez nous contacter à :
              </p>
              <p>
                <strong>Email :</strong> contact@colynephotographe.fr<br />
                <strong>Téléphone :</strong> +33 6 12 34 56 78<br />
                <strong>Adresse :</strong> Oye-plage, 62215, France
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialite;


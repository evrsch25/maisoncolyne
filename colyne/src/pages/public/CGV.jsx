import { motion } from 'framer-motion';

const CGV = () => {
  return (
    <div className="animate-fade-in min-h-screen bg-white py-16">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-display font-bold text-brown-dark mb-8">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 1 - Objet
              </h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles 
                entre Colyne Photographe et ses clients dans le cadre de prestations photographiques.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 2 - Réservation
              </h2>
              <p>
                La réservation d'une séance photo est effective après :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Validation de la date et de l'heure de la séance</li>
                <li>Signature du devis ou du contrat de prestation</li>
                <li>Versement d'un acompte de 30% du montant total</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 3 - Tarifs
              </h2>
              <p>
                Les tarifs indiqués sont en euros TTC. Ils comprennent :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>La séance photo d'une durée déterminée selon la formule choisie</li>
                <li>Le traitement et la retouche des photos selon la formule</li>
                <li>La livraison des photos en haute définition via galerie en ligne</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 4 - Modalités de paiement
              </h2>
              <p>
                Le règlement s'effectue :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>30% à la réservation (acompte)</li>
                <li>70% au plus tard le jour de la séance</li>
              </ul>
              <p>
                Modes de paiement acceptés : espèces, chèque, virement bancaire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 5 - Annulation et report
              </h2>
              <p>
                <strong>Par le client :</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Plus de 15 jours avant : acompte remboursé à 100%</li>
                <li>Entre 8 et 15 jours avant : acompte remboursé à 50%</li>
                <li>Moins de 8 jours avant : acompte non remboursé</li>
              </ul>
              <p>
                <strong>Par le photographe :</strong> En cas d'empêchement majeur, la séance est reportée 
                ou l'acompte intégralement remboursé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 6 - Livraison des photos
              </h2>
              <p>
                Les photos retouchées sont livrées sous 2 à 3 semaines après la séance via une galerie 
                en ligne privée et sécurisée. Les photos sont téléchargeables pendant 3 mois.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 7 - Droits d'auteur
              </h2>
              <p>
                Le photographe conserve l'entière propriété intellectuelle et les droits d'auteur sur 
                l'ensemble des photographies réalisées. Le client dispose d'un droit d'usage privé des 
                photographies pour un usage personnel et familial uniquement.
              </p>
              <p>
                Toute utilisation commerciale ou diffusion publique nécessite l'accord écrit préalable 
                du photographe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 8 - Droit à l'image
              </h2>
              <p>
                Le photographe se réserve le droit d'utiliser les photographies réalisées à des fins 
                promotionnelles (portfolio, site internet, réseaux sociaux) sauf opposition expresse 
                du client.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 9 - Responsabilité
              </h2>
              <p>
                Le photographe s'engage à mettre en œuvre tous les moyens nécessaires pour la bonne 
                réalisation de la prestation. En cas de force majeure empêchant la réalisation de la 
                prestation, sa responsabilité ne saurait être engagée.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display font-semibold text-brown-dark mb-4">
                Article 10 - Litiges
              </h2>
              <p>
                En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
                À défaut, les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CGV;


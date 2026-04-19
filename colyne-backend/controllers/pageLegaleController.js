const PageLegale = require('../models/PageLegale');

// Contenu par défaut (pré-rempli depuis le code actuel)
const DEFAULTS = {
  'mentions-legales': {
    title: 'Mentions Légales',
    sections: [
      { heading: 'Éditeur du site', content: 'Nom : Colyne Photographe\nStatut : Entreprise individuelle\nAdresse : Oye-plage, 62215, France\nEmail : maisoncolyne@gmail.com\nTéléphone : +33 6 67 91 47 07' },
      { heading: 'Directeur de publication', content: 'Colyne' },
      { heading: 'Hébergement', content: 'Ce site est hébergé par :\n[Nom de l\'hébergeur]\n[Adresse de l\'hébergeur]' },
      { heading: 'Propriété intellectuelle', content: 'L\'ensemble de ce site relève de la législation française et internationale sur le droit d\'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.\n\nLa reproduction de tout ou partie de ce site sur un support électronique quel qu\'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.' },
      { heading: 'Protection des données personnelles', content: 'Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d\'un droit d\'accès, de rectification et de suppression des données vous concernant.\n\nPour exercer ce droit, contactez-nous à : maisoncolyne@gmail.com' },
      { heading: 'Cookies', content: 'Ce site utilise des cookies uniquement pour améliorer l\'expérience utilisateur et mesurer l\'audience. Aucune donnée personnelle n\'est collectée sans votre consentement.' },
    ]
  },
  'cgv': {
    title: 'Conditions Générales de Vente',
    sections: [
      { heading: 'Article 1 - Objet', content: 'Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Colyne Photographe et ses clients dans le cadre de prestations photographiques.' },
      { heading: 'Article 2 - Réservation', content: 'La réservation d\'une séance photo est effective après :\n- Validation de la date et de l\'heure de la séance\n- Signature du devis ou du contrat de prestation\n- Versement d\'un acompte de 30% du montant total' },
      { heading: 'Article 3 - Tarifs', content: 'Les tarifs indiqués sont en euros TTC. Ils comprennent :\n- La séance photo d\'une durée déterminée selon la formule choisie\n- Le traitement et la retouche des photos selon la formule\n- La livraison des photos en haute définition via galerie en ligne' },
      { heading: 'Article 4 - Modalités de paiement', content: 'Le règlement s\'effectue :\n- 30% à la réservation (acompte)\n- 70% au plus tard le jour de la séance\n\nModes de paiement acceptés : espèces, chèque, virement bancaire.' },
      { heading: 'Article 5 - Annulation et report', content: 'Par le client :\n- Plus de 15 jours avant : acompte remboursé à 100%\n- Entre 8 et 15 jours avant : acompte remboursé à 50%\n- Moins de 8 jours avant : acompte non remboursé\n\nPar le photographe : En cas d\'empêchement majeur, la séance est reportée ou l\'acompte intégralement remboursé.' },
      { heading: 'Article 6 - Livraison des photos', content: 'Les photos retouchées sont livrées sous 2 à 3 semaines après la séance via une galerie en ligne privée et sécurisée. Les photos sont téléchargeables pendant 3 mois.' },
      { heading: 'Article 7 - Droits d\'auteur', content: 'Le photographe conserve l\'entière propriété intellectuelle et les droits d\'auteur sur l\'ensemble des photographies réalisées. Le client dispose d\'un droit d\'usage privé des photographies pour un usage personnel et familial uniquement.\n\nToute utilisation commerciale ou diffusion publique nécessite l\'accord écrit préalable du photographe.' },
      { heading: 'Article 8 - Droit à l\'image', content: 'Le photographe se réserve le droit d\'utiliser les photographies réalisées à des fins promotionnelles (portfolio, site internet, réseaux sociaux) sauf opposition expresse du client.' },
      { heading: 'Article 9 - Responsabilité', content: 'Le photographe s\'engage à mettre en œuvre tous les moyens nécessaires pour la bonne réalisation de la prestation. En cas de force majeure empêchant la réalisation de la prestation, sa responsabilité ne saurait être engagée.' },
      { heading: 'Article 10 - Litiges', content: 'En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.' },
    ]
  },
  'politique-confidentialite': {
    title: 'Politique de Confidentialité',
    sections: [
      { heading: 'Collecte des données', content: 'Dans le cadre de l\'utilisation de ce site, nous collectons uniquement les données que vous nous communiquez volontairement via le formulaire de contact (nom, prénom, email, téléphone, message).' },
      { heading: 'Utilisation des données', content: 'Les données collectées sont utilisées uniquement pour :\n- Répondre à vos demandes de contact\n- Gérer les réservations de séances\n- Vous envoyer des informations relatives à nos services si vous y consentez' },
      { heading: 'Conservation des données', content: 'Vos données personnelles sont conservées pendant une durée de 3 ans après notre dernier contact, conformément à la réglementation en vigueur.' },
      { heading: 'Droits des utilisateurs', content: 'Conformément au RGPD, vous disposez des droits suivants :\n- Droit d\'accès à vos données\n- Droit de rectification\n- Droit à l\'effacement\n- Droit à la portabilité\n- Droit d\'opposition\n\nPour exercer ces droits, contactez-nous à : maisoncolyne@gmail.com' },
      { heading: 'Cookies', content: 'Ce site utilise des cookies techniques indispensables au fonctionnement du site. Aucun cookie publicitaire ou de tracking n\'est utilisé.' },
      { heading: 'Contact', content: 'Pour toute question relative à la protection de vos données, contactez :\nMaison Colyne\nmaisoncolyne@gmail.com' },
    ]
  }
};

// @desc    Récupérer une page légale par slug (public)
// @route   GET /api/pages-legales/:slug
// @access  Public
exports.getPageLegale = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let page = await PageLegale.findOne({ slug });

    // Si la page n'existe pas encore en BDD, retourner le contenu par défaut
    if (!page) {
      const def = DEFAULTS[slug];
      if (!def) return res.status(404).json({ success: false, message: 'Page non trouvée' });
      return res.status(200).json({ success: true, data: { slug, ...def }, isDefault: true });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une page légale (admin)
// @route   PUT /api/pages-legales/:slug
// @access  Private/Admin
exports.updatePageLegale = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, sections } = req.body;

    const page = await PageLegale.findOneAndUpdate(
      { slug },
      { slug, title, sections, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: page, message: 'Page mise à jour avec succès' });
  } catch (error) {
    next(error);
  }
};

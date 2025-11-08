import { useState } from 'react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { contactAPI } from '../utils/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
    preferredDate: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await contactAPI.send(formData);
      setIsSubmitted(true);

      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          serviceType: '',
          message: '',
          preferredDate: '',
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      const message = err.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du message.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center"
      >
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
          Message envoyé !
        </h3>
        <p className="text-gray-600">
          Merci pour votre message. Je vous répondrai dans les plus brefs délais.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Votre prénom"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="votre.email@exemple.fr"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
          Type de séance *
        </label>
        <select
          id="serviceType"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className="input-field"
        >
          <option value="">Sélectionnez un type de séance</option>
          <option value="grossesse">Séance Grossesse</option>
          <option value="nouveau-ne">Nouveau-né</option>
          <option value="famille">Portrait Famille</option>
          <option value="couple">Séance Couple</option>
          <option value="mariage">Mariage</option>
          <option value="portrait">Portrait Individuel</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
          Date souhaitée
        </label>
        <input
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Votre message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="textarea-field"
          placeholder="Parlez-moi de votre projet..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send size={20} />
            <span>Envoyer le message</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;


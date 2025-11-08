import { useEffect, useState } from 'react';
import { contactAPI } from '../../utils/api';
import {
  Loader2,
  Filter,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Trash2,
  CheckCircle,
  Archive,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusLabels = {
  nouveau: 'Nouveau',
  lu: 'Lu',
  traite: 'Traité',
  archive: 'Archivé',
};

const statusStyles = {
  nouveau: 'bg-green-100 text-green-800',
  lu: 'bg-blue-100 text-blue-800',
  traite: 'bg-amber-100 text-amber-800',
  archive: 'bg-gray-100 text-gray-600',
};

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await contactAPI.getAll(params);
      if (response.success) {
        const list = response.data;
        setMessages(list);
        setSelectedMessage((prev) => {
          if (!prev) return prev;
          const updated = list.find((item) => item._id === prev._id);
          return updated || prev;
        });
      }
    } catch (err) {
      setError('Impossible de charger les messages pour le moment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filterStatus]);

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);

    if (message.status === 'nouveau') {
      try {
        await contactAPI.updateStatus(message._id, { status: 'lu' });
        loadMessages();
      } catch (err) {
        console.error('Erreur lors de la mise à jour du statut:', err);
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    setIsProcessing(true);
    try {
      await contactAPI.updateStatus(id, { status });
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, status } : prev));
      }
      await loadMessages();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement ce message ?')) {
      return;
    }

    setIsProcessing(true);
    try {
      await contactAPI.delete(id);
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      await loadMessages();
    } catch (err) {
      console.error('Erreur lors de la suppression du message:', err);
      setError('Impossible de supprimer le message.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Messages de contact</h1>
          <p className="text-gray-600">Consultez et gérez les demandes envoyées depuis le formulaire de contact.</p>
        </div>

        <div className="flex items-center gap-3">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">Tous les statuts</option>
            <option value="nouveau">Nouveaux</option>
            <option value="lu">Lus</option>
            <option value="traite">Traités</option>
            <option value="archive">Archivés</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-brown" />
                <span className="font-semibold text-gray-900">Messages ({messages.length})</span>
              </div>
              {loading && <Loader2 size={18} className="animate-spin text-gray-500" />}
            </div>

            <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  Chargement...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  Aucun message pour le moment.
                </div>
              ) : (
                messages.map((message) => (
                  <button
                    key={message._id}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full text-left px-4 py-3 hover:bg-beige-light transition-colors ${
                      selectedMessage?._id === message._id ? 'bg-beige-light' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">
                        {message.firstName} {message.lastName}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          statusStyles[message.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {statusLabels[message.status] || message.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      {message.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(message.createdAt)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-md p-6 space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">
                      {selectedMessage.firstName} {selectedMessage.lastName}
                    </h2>
                    <p className="text-gray-500">
                      Requête pour : <span className="font-medium text-gray-800">{selectedMessage.serviceType}</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Reçu le {formatDateTime(selectedMessage.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(selectedMessage._id, 'traite')}
                      className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      Marquer comme traité
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleStatusChange(selectedMessage._id, 'archive')}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Archive size={16} />
                      Archiver
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="px-3 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-brown mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-gray-700 hover:text-brown">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {selectedMessage.phone && (
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-brown mt-1" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Téléphone</p>
                        <a href={`tel:${selectedMessage.phone}`} className="text-gray-700 hover:text-brown">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedMessage.preferredDate && (
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-brown mt-1" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Date souhaitée</p>
                        <p className="text-gray-700">
                          {new Date(selectedMessage.preferredDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brown mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Statut</p>
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                          statusStyles[selectedMessage.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Eye size={14} />
                        {statusLabels[selectedMessage.status] || selectedMessage.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-beige-light rounded-lg p-6">
                  <h3 className="text-lg font-display font-semibold text-brown-dark mb-3">
                    Message
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500"
              >
                <MessageCircle size={40} className="mx-auto text-gray-300 mb-4" />
                Sélectionnez un message dans la liste pour afficher les détails.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesAdmin;

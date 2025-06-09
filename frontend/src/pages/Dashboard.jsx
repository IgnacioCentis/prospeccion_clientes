// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FileUpload from '../components/FileUpload';
import LeadsTable from '../components/LeadsTable';
import { Eye, Mail, Loader } from 'lucide-react'; // <-- importamos Loader

export default function Dashboard() {
  const { logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');

  // Estados de carga
  const [loadingScrape, setLoadingScrape] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const loadLeads = async () => {
    const res = await api.get('/leads');
    setLeads(res.data);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmail('');
  };

  const handleSendEmail = async (id) => {
    // Opcional: podés añadir un estado de loading si querés un spinner
    try {
      const res = await api.post(`/leads/${id}/send`);
      if (res.data.success) {
        alert('✉️ Email enviado correctamente');
      } else {
        alert(`❌ Error al enviar: ${res.data.error}`);
      }
    } catch (err) {
      alert(`❌ Error al enviar: ${err.response?.data?.error || err.message}`);
    }
    // Refresca la tabla para actualizar el estado "enviado"
    loadLeads();
  };

  // Nuevo método para Scrape con loader
  const onScrape = async () => {
    setLoadingScrape(true);
    try {
      const res = await api.post('/scrape');
      if (res.data.success) {
        alert(`✔️ Scrape exitoso: ${res.data.processed} procesados` +
          (res.data.errors.length
            ? `\n⚠️ Errores en ${res.data.errors.length}` : ''
          )
        );
      } else {
        alert(`❌ Scrape falló: ${res.data.error}`);
      }
    } catch (e) {
      alert(`❌ Error al scrapear: ${e.response?.data?.error || e.message}`);
    } finally {
      setLoadingScrape(false);
      loadLeads();
    }
  };

  // Nuevo método para Generate con loader
  const onGenerate = async () => {
    setLoadingGenerate(true);
    try {
      const res = await api.post('/generate');
      if (res.data.success) {
        alert(`✔️ Emails generados: ${res.data.generated}` +
          (res.data.errors.length
            ? `\n⚠️ Falló en ${res.data.errors.length}` : ''
          )
        );
      } else {
        alert(`❌ Generación falló: ${res.data.error}`);
      }
    } catch (e) {
      alert(`❌ Error al generar emails: ${e.response?.data?.error || e.message}`);
    } finally {
      setLoadingGenerate(false);
      loadLeads();
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Prospector de ventas </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Upload */}
      <FileUpload onUpload={loadLeads} />

      {/* Botones con loader */}
      <div className="mb-4 space-x-2">
        <button
          onClick={onScrape}
          disabled={loadingScrape || loadingGenerate}
          className={`flex items-center p-2 rounded transition ${
            loadingScrape
              ? 'bg-green-300 text-white cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {loadingScrape && <Loader className="animate-spin w-5 h-5 mr-2" />}
          {loadingScrape ? 'Procesando...' : 'Scrapear Leads'}
        </button>

        <button
          onClick={onGenerate}
          disabled={loadingGenerate || loadingScrape}
          className={`flex items-center p-2 rounded transition ${
            loadingGenerate
              ? 'bg-purple-300 text-white cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {loadingGenerate && <Loader className="animate-spin w-5 h-5 mr-2" />}
          {loadingGenerate ? 'Procesando...' : 'Redactar email'}
        </button>
      </div>

      {/* Tabla de leads */}
      <LeadsTable
        leads={leads}
        onViewEmail={handleViewEmail}
        onSendEmail={handleSendEmail}
      />

      {/* Modal de email */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Email Redactado</h2>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
              {selectedEmail}
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

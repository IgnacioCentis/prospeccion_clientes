import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FileUpload from '../components/FileUpload';
import LeadsTable from '../components/LeadsTable';

export default function Dashboard() {
  const { logout } = useAuth();
  const [leads, setLeads] = useState([]);
  // Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');

  const loadLeads = async () => {
    const res = await api.get('/leads');
    setLeads(res.data);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Función que abre el modal
  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmail('');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl">Dashboard</h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

      <FileUpload onUpload={loadLeads} />

      {/* Botones Scrape/Generate (igual que antes) */}
      <div className="mb-4 space-x-2">
        <button
          onClick={async () => {
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
            }
            loadLeads();
          }}
          className="bg-green-500 text-white p-2 rounded"
        >
          Scrapear Leads
        </button>

        <button
          onClick={async () => {
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
            }
            loadLeads();
          }}
          className="bg-purple-500 text-white p-2 rounded"
        >
          Redactar Email
        </button>
      </div>

      {/* Tabla de leads con función para ver email */}
      <LeadsTable leads={leads} onViewEmail={handleViewEmail} />

      {/* Modal para mostrar el email generado */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Email Redactado</h2>
            <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
              {selectedEmail}
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

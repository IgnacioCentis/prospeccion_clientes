// src/components/FileUpload.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { CloudUpload } from 'lucide-react';

export default function FileUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await api.post('/upload', form);
      // El backend responde { success: true, count: X }
      if (res.data.success) {
        setMessage({ 
          type: 'success', 
          text: `✔️ Se procesaron ${res.data.count} leads correctamente.` 
        });
        onUpload();
      } else {
        setMessage({ 
          type: 'error', 
          text: `❌ Falló el procesamiento: ${res.data.error}` 
        });
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: `❌ Error al subir: ${err.response?.data?.error || err.message}` 
      });
    } finally {
      setUploading(false);
      // Limpia el input para poder re-subir el mismo archivo si querés
      e.target.value = null;
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center px-6 py-8 bg-white text-blue-600 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition"
      >
        <CloudUpload className="w-10 h-10 mb-3" />
        <span className="text-sm font-medium">
          {uploading ? 'Procesando…' : 'Hacé clic o arrastrá tu archivo (.txt, .xlsx)'}
        </span>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.xlsx"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
      </label>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}

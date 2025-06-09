// src/components/LeadsTable.jsx
import React from 'react';
import { Eye, Mail } from 'lucide-react';

export default function LeadsTable({ leads, onViewEmail, onSendEmail }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow text-sm sm:text-base">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">URL</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Generado</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Ver</th>
            <th className="px-4 py-2">Enviar</th>   {/* Nueva columna */}
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-t even:bg-gray-50">
              <td className="px-4 py-2 break-words max-w-xs">{l.url}</td>
              <td className="px-4 py-2">{l.email || '-'}</td>
              <td className="px-4 py-2">{l.telefono || '-'}</td>
              <td className="px-4 py-2 text-center">
                {l.email_redactado ? '✅' : '❌'}
              </td>
              <td className="px-4 py-2">{l.estado_email}</td>
              <td className="px-4 py-2 text-center">
                {l.email_redactado ? (
                  <button
                    onClick={() => onViewEmail(l.email_redactado)}
                    className="flex items-center justify-center text-blue-500 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </button>
                ) : '-'}
              </td>
              <td className="px-4 py-2 text-center">
                {l.email_redactado && l.estado_email !== 'enviado' ? (
                  <button
                    onClick={() => onSendEmail(l.id)}
                    className="flex items-center justify-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Enviar
                  </button>
                ) : l.estado_email === 'enviado' ? (
                  <span className="text-green-600">✔️</span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

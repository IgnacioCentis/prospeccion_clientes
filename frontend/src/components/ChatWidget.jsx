
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import api from '../services/api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant', { message: input });
      const reply = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, reply]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error al responder.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button onClick={toggleChat} className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          <MessageCircle />
        </button>
      ) : (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t">
            <strong>Asistente IA</strong>
            <button onClick={toggleChat}><X /></button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-sm text-gray-400">⏳ Pensando...</div>}
          </div>
          <div className="p-3 border-t flex">
            <input
              className="flex-1 border rounded px-2 py-1 mr-2"
              placeholder="Escribí tu pregunta..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

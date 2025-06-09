
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageCircle, Loader, X, Volume2, VolumeX } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const savedVoicePref = localStorage.getItem('voiceEnabled');
    if (savedVoicePref !== null) {
      setVoiceEnabled(savedVoicePref === 'true');
    }
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = '👋 ¡Hola! Soy tu Agente IA. ¿En qué puedo ayudarte hoy con tus leads?';
      speak(greeting);
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [open]);

  const speak = (text) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = 'es-ES';
      utterance.rate = 0.95;   // velocidad
      utterance.pitch = 1.1;   // tono
      utterance.volume = 1;    // volumen
      speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant', { message: input });
      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch (err) {
      const errorMsg = '❌ Error en el asistente.';
      setMessages([...newMessages, { role: 'assistant', content: errorMsg }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    localStorage.setItem('voiceEnabled', newState);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          {showTooltip && (
            <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 shadow">
              Chatear con IA
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="w-80 bg-white border rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="flex justify-between items-center p-2 border-b bg-blue-100">
            <span className="text-sm font-medium text-gray-700">Agente IA</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleVoice}
                className="text-gray-500 hover:text-gray-700"
                title="Activar/desactivar voz"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2" style={{ maxHeight: '300px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="flex justify-center animate-spin text-blue-500 p-2">
                <Loader className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="p-2 border-t flex items-center space-x-2">
            <input
              className="flex-1 border rounded p-2 text-sm"
              placeholder="Escribí tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

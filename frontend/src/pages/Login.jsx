import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';  


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => { e.preventDefault(); try { await login(username, password); nav('/'); } catch { alert('Login error'); } };

return (
  <div className="h-screen flex items-center justify-center bg-gray-100">
    <form onSubmit={submit} className="p-8 bg-white rounded shadow-md w-80 flex flex-col items-center">
      <img src={logo} alt="Logo" className="w-24 h-24 mb-6" />
      <h2 className="mb-4 text-2xl">Login</h2>
      <h2 className="mb-4 text-1xl">Prospeccion de Ventas </h2>

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 mb-4 w-full"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Entrar</button>
    </form>
  </div>
);
}
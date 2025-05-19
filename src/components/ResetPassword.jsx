import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Token inválido o faltante.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage('Contraseña restablecida exitosamente.');
      } else {
        const error = await response.text();
        setMessage(error);
      }
    } catch (err) {
      setMessage('Error al procesar la solicitud.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={`${window.location.origin}/logo.png`} alt="Logo" className="w-auto h-40 mb-8 object-contain" />
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Restablecer Contraseña</h1>
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg" onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="login-button">Restablecer Contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;
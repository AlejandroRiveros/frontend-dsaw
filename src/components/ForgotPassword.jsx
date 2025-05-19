import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Se ha enviado un enlace para restablecer la contraseña a su correo.');
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
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg" onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600"
        >
          Enviar Enlace
        </button>
      </form>
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
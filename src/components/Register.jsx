import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('email') || '';
  });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        if (email === 'admin@possabana.com') {
          setMessage('Usuario administrador registrado exitosamente.');
        } else {
          setMessage('Usuario registrado exitosamente.');
        }
      } else {
        const error = await response.text();
        setMessage(error);
      }
    } catch (err) {
      setMessage('Error al registrar el usuario.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 md:px-8">
      <img src={`${window.location.origin}/logo.png`} alt="Logo" className="w-auto h-40 mb-8 object-contain md:h-48" />
      <h1 className="text-3xl font-bold text-blue-700 mb-6 md:text-4xl">Registrarse</h1>
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg md:max-w-lg" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 md:py-4"
        >
          Registrarse
        </button>
      </form>
      <div className="flex justify-center items-center mt-4">
        <a href="/" className="text-blue-500 hover:underline text-sm md:text-base">¿Ya tienes cuenta? Inicia sesión</a>
      </div>
      {message && <p className="text-center text-sm md:text-base">{message}</p>}
    </div>
  );
}

export default Register;
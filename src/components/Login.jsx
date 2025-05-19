import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import HomeCliente from './HomeCliente.jsx';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [unregisteredEmail, setUnregisteredEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya hay un token válido, redirigir a /home-cliente
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        if (!isTokenExpired) {
          if (decoded.role === 'Cliente') {
            navigate('/home-cliente', { replace: true });
          } else if (decoded.role === 'POS') {
            navigate('/home-pos', { replace: true });
          }
        }
      } catch (e) {
        // Token inválido, no hacer nada
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
      setMessage('');
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Por favor, ingrese su contraseña.');
      setMessage('');
    } else {
      setPasswordError('');
    }

    if (!email || !password) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 404) {
        setUnregisteredEmail(email);
        setShowModal(true);
        return;
      }

      if (response.status === 401 && emailError === '' && passwordError === '') {
        setPasswordError('Contraseña incorrecta.');
        setPassword('');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setMessage('Inicio de sesión exitoso.');

        const decodedToken = jwtDecode(data.token);
        const userRole = decodedToken.role;

        if (userRole === 'Cliente') {
          window.location.href = '/home-cliente';
        } else if (userRole === 'POS') {
          window.location.href = '/home-pos';
        }
      } else {
        const error = await response.text();
        setMessage(error);
      }
    } catch (err) {
      setMessage(
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> No se pudo iniciar sesión. Por favor, verifica tus credenciales.</span>
        </div>
      );
    }
  };

  const handleRegisterRedirect = () => {
    window.location.href = `/register?email=${encodeURIComponent(unregisteredEmail)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 md:px-8">
<img src="/logo.png" alt="Logo" />
<h1 className="text-3xl font-bold text-blue-700 mb-6 md:text-4xl">Iniciar Sesión</h1>
      <form className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg md:max-w-lg" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (e.target.value) setEmailError('');
          }}
          className={`w-full px-4 py-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            emailError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value) setPasswordError('');
          }}
          className={`w-full px-4 py-3 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            passwordError ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

        <div className="text-right">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            ¿Olvidó su contraseña?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 md:py-4">
          Iniciar Sesión
        </button>
      </form>
      <div className="flex justify-center items-center mt-4">
        <a href="/register" className="text-blue-500 hover:underline text-sm md:text-base">¿No tienes cuenta? Regístrate</a>
      </div>
      {message && <p className="text-center text-sm md:text-base">{message}</p>}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">El correo no está registrado. ¿Desea registrarse?</p>
            <button
              onClick={handleRegisterRedirect}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Registrarse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from 'react';

function HistorialPedidos() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Error al obtener el historial de pedidos');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  const statusStyles = {
    Pendiente: 'border-yellow-400 bg-yellow-50 text-yellow-800',
    Confirmado: 'border-green-400 bg-green-50 text-green-800',
    Completado: 'border-green-400 bg-green-50 text-green-800',
    Cancelado: 'border-red-400 bg-red-50 text-red-800',
  };

  const statusIcons = {
    Pendiente: (
      <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 9H9V5h2v6z" />
      </svg>
    ),
    Confirmado: (
      <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    Completado: (
      <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    Cancelado: (
      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-blue-700 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Historial de Pedidos</h1>
        <img src="/logo.png" alt="Logo" className="h-10" />
      </header>

      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Tus Pedidos</h2>
        <div className="space-y-6">
          {orders.filter(order => order.status).map((order) => {
            const rawStatus = order.status;
            const estado = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();
            const statusClass = statusStyles[estado] || 'border-gray-300 bg-white text-gray-800';
            const icon = statusIcons[estado] || null;

            return (
              <div
                key={order._id}
                className={`relative border-l-8 rounded-lg shadow-md p-5 ${statusClass}`}
              >
                <div className="mb-2 flex items-center">
                  {icon}
                  <h3 className="text-lg font-semibold">Pedido #{order._id.slice(-6)}</h3>
                </div>
                <p className="text-sm mb-1">Estado: <span className="capitalize font-medium">{estado}</span></p>
                <p className="text-sm mb-2">Fecha: {new Date(order.createdAt).toLocaleString('es-CO')}</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {order.products.map((product, index) => (
                    <li key={index}>
                      <span className="font-medium">{product.name}</span> — {product.quantity} unidad{product.quantity > 1 ? 'es' : ''}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-bold mt-2">Total: ${order.total?.toLocaleString('es-CO')}</p>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="fixed bottom-4 left-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg z-50"
      >
        Volver
      </button>
    </div>
  );
}

export default HistorialPedidos;

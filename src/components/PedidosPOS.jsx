import React, { useState, useEffect } from 'react';

function PedidosPOS() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Error al obtener los pedidos');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: 'cancelado' } : order
          )
        );
        alert('Pedido cancelado y stock revertido correctamente');
      } else {
        const data = await response.json();
        alert(data.error || 'Error al cancelar el pedido');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error al conectar con el servidor para cancelar el pedido');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'cancelado') {
      await handleCancelOrder(orderId);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Error al actualizar el estado del pedido');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  const getStatusStyles = (status) => {
    const color = {
      pendiente: 'border-yellow-400 bg-yellow-50 text-yellow-800',
      confirmado: 'border-green-400 bg-green-50 text-green-800',
      'en preparación': 'border-blue-400 bg-blue-50 text-blue-800',
      entregado: 'border-cyan-400 bg-cyan-50 text-cyan-800',
      cancelado: 'border-red-400 bg-red-50 text-red-800',
    };
    return color[status] || 'border-gray-300 bg-white text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pendiente: (
        <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 9H9V5h2v6z" />
        </svg>
      ),
      confirmado: (
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      'en preparación': (
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
        </svg>
      ),
      entregado: (
        <svg className="w-5 h-5 mr-2 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
        </svg>
      ),
      cancelado: (
        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    };
    return icons[status] || null;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full bg-blue-700 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Pedidos</h1>
        <img src="/logo.png" alt="Logo" className="h-10" />
      </header>

      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-6">Lista de Pedidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const estado = order.status;
            const locked = estado === 'confirmado' || estado === 'cancelado';
            const statusStyle = getStatusStyles(estado);
            const statusIcon = getStatusIcon(estado);

            return (
              <div
                key={order._id}
                className={`relative border-l-8 rounded-xl shadow-md p-6 ${statusStyle}`}
              >
                <div className="mb-2 flex items-center">
                  {statusIcon}
                  <h3 className="text-lg font-semibold">
                    Pedido <span className="text-blue-800">#{order._id.slice(-6)}</span>
                  </h3>
                </div>
                <p className="text-sm mb-1">Estado: <span className="capitalize font-medium">{estado}</span></p>
                <ul className="list-disc pl-5 text-sm mb-2">
                  {order.products.map((product, index) => (
                    <li key={index}>
                      <strong>{product.name}</strong> — {product.quantity} unidad{product.quantity > 1 ? 'es' : ''}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 italic">
                  Registrado: {new Date(order.createdAt).toLocaleString('es-CO')}
                </p>

                {locked ? (
                  <input
                    disabled
                    value={estado.charAt(0).toUpperCase() + estado.slice(1)}
                    className="mt-4 w-full p-2 bg-gray-200 border border-gray-300 rounded-lg text-sm text-center"
                  />
                ) : (
                  <select
                    value={estado}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="mt-4 w-full border border-gray-300 rounded-lg p-2 text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="en preparación">En preparación</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                )}
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

export default PedidosPOS;

import React, { useState, useEffect } from 'react';

function Carrito() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartWithQty = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));
    setCartItems(cartWithQty);
    localStorage.setItem('cart', JSON.stringify(cartWithQty));
  }, []);

  const updateQuantity = (index, delta) => {
    setCartItems(prev => {
      const updated = prev.map((item, i) => {
        if (i !== index) return item;
        const maxStock = item.stock || 99;
        const newQty = (item.quantity || 1) + delta;
        if (newQty < 1) return { ...item, quantity: 1 };
        if (newQty > maxStock) {
          setMessage(
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 rounded shadow-md" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.257 3.099c.765-1.36 2.68-1.36 3.445 0l6.518 11.598c.75 1.336-.213 2.998-1.723 2.998H3.462c-1.51 0-2.473-1.662-1.723-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 112 0v3a1 1 0 01-1 1z"/>
                </svg>
                <div>
                  <p className="font-semibold">Límite alcanzado</p>
                  <p>No puedes agregar más de <span className="font-bold">{maxStock}</span> unidades de este producto.</p>
                </div>
              </div>
            </div>
          );
          return item;
        }
        return { ...item, quantity: newQty };
      });
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const validateStock = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/validate-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })) })
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Error al validar el stock.');
        return false;
      }

      return true;
    } catch (error) {
      alert('Error al conectar con el servidor para validar el stock.');
      return false;
    }
  };

  const handleConfirmOrder = async () => {
    try {
      if (cartItems.length === 0) {
        alert('El carrito está vacío.');
        return;
      }

      const isStockValid = await validateStock();
      if (!isStockValid) return;

      const products = cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
        localStorage.removeItem('cart');
        setCartItems([]);
      } else {
        const data = await response.json();
        alert(data.error || 'Error al realizar el pedido');
      }
    } catch (error) {
      alert('Error al conectar con el servidor para realizar el pedido.');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatPrice = (price) => price.toLocaleString('es-CO');

  return (
    <div className="min-h-screen bg-gray-100">
      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3 animate-bounce">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">¡Pedido realizado con éxito!</span>
        </div>
      )}

      <header className="w-full bg-blue-700 text-white py-4 px-8 flex justify-between items-center">
        <button className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Carrito</h1>
        <img src={`${window.location.origin}/logo.png`} alt="Logo" className="h-10" />
      </header>

      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4">Tu carrito</h2>
        {message && <div className="mb-4">{message}</div>}
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between border-b pb-4 bg-white rounded-lg shadow-md p-4 transition-transform hover:scale-[1.02]">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border-2 border-blue-200">
                  {item.image ? (
                    <img src={`${import.meta.env.VITE_API_URL}${item.image}`} alt={item.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>
                <div className="min-w-[120px] text-center md:text-left">
                  <h3 className="font-bold text-lg text-blue-700">{item.name}</h3>
                  <p className="text-gray-600 font-semibold">Precio unitario: <span className="text-black">${formatPrice(item.price)}</span></p>
                </div>
                <div className="flex items-center mx-2 bg-blue-50 rounded-lg shadow px-2">
                  <button onClick={() => updateQuantity(index, -1)} className="px-2 py-1 bg-blue-200 text-blue-700 font-bold rounded-l hover:bg-blue-300">-</button>
                  <span className="px-3 font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(index, 1)} className="px-2 py-1 bg-blue-200 text-blue-700 font-bold rounded-r hover:bg-blue-300">+</button>
                </div>
                <div className="font-bold text-green-700 ml-4">Subtotal: ${formatPrice(item.price * item.quantity)}</div>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700 mt-2 md:mt-0"
                title="Eliminar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 0m0 0l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14m-14 0h14m-10 0v-2a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <h3 className="text-xl font-bold">Total: ${formatPrice(total)}</h3>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleConfirmOrder}>Confirmar</button>
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="absolute bottom-4 left-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Volver
      </button>
    </div>
  );
}

export default Carrito;

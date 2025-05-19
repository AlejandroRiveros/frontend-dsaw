import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactModal from 'react-modal';
import ErrorMessage from './ErrorMessage.jsx';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebaseConfig';

ReactModal.setAppElement('#root');

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [units, setUnits] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const storage = getStorage(app);

  const formatPrice = (value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (e) => {
    const formattedPrice = formatPrice(e.target.value);
    setPrice(formattedPrice);
  };

  const parsePrice = (formattedPrice) => {
    if (typeof formattedPrice !== 'string') return 0;
    return parseInt(formattedPrice.replace(/\./g, ''), 10);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/${id}`);
        if (response.ok) {
          const product = await response.json();
          setProductName(product.name);
          setPrice(product.price);
          setUnits(product.stock);
          setCategory(product.category || '');
          setRestaurant(product.restaurant || '');
          setCurrentImage(product.image);
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      let imageUrl = currentImage;

      if (newImageFile) {
        const storageRef = ref(storage, `products/${Date.now()}-${newImageFile.name}`);
        await uploadBytes(storageRef, newImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName,
          price: parsePrice(price),
          stock: units,
          category,
          restaurant,
          image: imageUrl
        }),
      });

      if (response.ok) {
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/inventory');
        }, 3000);
      } else {
        console.error('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  const handleDeleteConfirmation = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/inventory/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteModalOpen(false);
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/inventory');
        }, 3000);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/inventory');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ReactModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold text-red-600 mb-4">¿Estás seguro que quieres eliminar este producto?</h2>
        <div className="flex justify-center space-x-4">
          <button onClick={handleDeleteConfirmation} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Sí
          </button>
          <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            No
          </button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto text-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold text-green-600 mb-4">¡Producto actualizado!</h2>
        <p className="text-gray-700">Los cambios se han guardado correctamente.</p>
      </ReactModal>

      <header className="w-full bg-blue-700 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Nombre de POS</h1>
        <h2 className="text-lg">Editar Producto</h2>
        <img src={`${window.location.origin}/logo.png`} alt="Logo" className="h-10" />
      </header>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="border border-gray-300 rounded-lg p-8 bg-white w-96">
          <div className="h-48 bg-gray-200 flex items-center justify-center mb-4 rounded">
            {newImageFile ? (
              <img src={URL.createObjectURL(newImageFile)} alt="Vista previa" className="h-full object-cover rounded" />
            ) : currentImage ? (
              <img src={currentImage} alt="Imagen actual" className="h-full object-cover rounded" />
            ) : (
              <span className="text-gray-500">Sin imagen</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Cambiar imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Nombre Producto:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Precio:</label>
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Unidades:</label>
            <input
              type="text"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Categoría:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Comidas Rápidas">Comidas Rápidas</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Snacks">Snacks</option>
              <option value="Menú del Día">Menú del Día</option>
              <option value="Saludable">Saludable</option>
              <option value="Panadería">Panadería</option>
              <option value="Postres">Postres</option>
              <option value="Desayunos">Desayunos</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Restaurante:</label>
            <select
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Selecciona un restaurante</option>
              <option value="Cafe Bolsa">Cafe Bolsa</option>
              <option value="Kioskos">Kioskos</option>
              <option value="Restaurante Escuela">Restaurante Escuela</option>
              <option value="Punto Wok">Punto Wok</option>
              <option value="Embarcadero">Embarcadero</option>
              <option value="Punto Sandwich">Punto Sandwich</option>
              <option value="El Meson">El Meson</option>
              <option value="Terraza Living Lab">Terraza Living Lab</option>
            </select>
          </div>

          <button onClick={handleUpdate} className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full">
            Actualizar
          </button>

          <button onClick={() => setIsDeleteModalOpen(true)} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full">
            Eliminar
          </button>
        </div>

        <button onClick={() => navigate('/inventory')} className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Volver
        </button>
      </div>
    </div>
  );
}

export default EditProduct;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebaseConfig';

function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storage = getStorage(app);

  const [formData, setFormData] = useState({
    name: '',
    horario: '',
    description: '',
    latitude: '',
    longitude: '',
    icon: '',
    image: '',
    menu: '',
  });

  const [newImageFile, setNewImageFile] = useState(null);
  const [newMenuFile, setNewMenuFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`https://backend-proyecto-dsaw-production.up.railway.app/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .catch(err => console.error('Error al cargar restaurante:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setNewImageFile(e.target.files[0]);
  };

  const handleMenuChange = (e) => {
    setNewMenuFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      let menuUrl = formData.menu;

      if (newImageFile) {
        const imageRef = ref(storage, `restaurants/${Date.now()}-${newImageFile.name}`);
        await uploadBytes(imageRef, newImageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (newMenuFile) {
        const menuRef = ref(storage, `menus/${Date.now()}-${newMenuFile.name}`);
        await uploadBytes(menuRef, newMenuFile);
        menuUrl = await getDownloadURL(menuRef);
      }

      const updatedData = {
        ...formData,
        image: imageUrl,
        menu: menuUrl,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      const res = await fetch(`https://backend-proyecto-dsaw-production.up.railway.app/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Error al actualizar restaurante');
      alert('Restaurante actualizado con éxito');
      navigate('/restaurantesPOS');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar restaurante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/restaurantesPOS')}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          ← Volver
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">✏️ Editar Restaurante</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required className="w-full p-3 border rounded" />
          <input name="horario" value={formData.horario} onChange={handleChange} placeholder="Horario" required className="w-full p-3 border rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" required className="w-full p-3 border rounded" />

          <div className="flex gap-2">
            <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} placeholder="Latitud" required className="w-1/2 p-3 border rounded" />
            <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Longitud" required className="w-1/2 p-3 border rounded" />
          </div>

          <select name="icon" value={formData.icon} onChange={handleChange} className="w-full p-3 border rounded" required>
            <option value="">Seleccionar icono</option>
            <option value="cafe">☕ Café</option>
            <option value="sandwich">🥪 Sandwich</option>
            <option value="comida">🍽️ Comida</option>
            <option value="wok">🍜 Wok</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen actual:</label>
            <img src={formData.image} alt="Imagen actual" className="h-32 w-full object-cover rounded" />
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menú actual:</label>
            <a href={formData.menu} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver menú PDF</a>
            <input type="file" accept="application/pdf" onChange={handleMenuChange} className="mt-2 w-full border p-2 rounded" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Proyecto institucional de <a href="https://www.unisabana.edu.co/" className="text-blue-700 underline" target="_blank" rel="noreferrer">La Universidad de La Sabana</a>
        </p>
      </div>
    </div>
  );
}

export default EditRestaurant;

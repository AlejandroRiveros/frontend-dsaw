import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../firebaseConfig';

function AddRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    horario: '',
    description: '',
    latitude: '',
    longitude: '',
    icon: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [menuPdf, setMenuPdf] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const storage = getStorage(app);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e) => {
    setMenuPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      let menuUrl = '';

      if (imageFile) {
        const safeImageName = imageFile.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
        const imageRef = ref(storage, `restaurants/${Date.now()}-${safeImageName}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (menuPdf) {
        const safePdfName = menuPdf.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
        const pdfRef = ref(storage, `menus/${Date.now()}-${safePdfName}`);
        await uploadBytes(pdfRef, menuPdf);
        menuUrl = await getDownloadURL(pdfRef);
      }

      const restaurantData = { ...formData, image: imageUrl,
        menu: menuUrl,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude), };
console.log("Datos enviados al backend:", restaurantData);


      await fetch('https://backend-proyecto-dsaw-production.up.railway.app/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData)
      });

      alert("Restaurante guardado exitosamente");
    } catch (error) {
      console.error("Error al subir restaurante:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Agregar Restaurante</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" required />
          <input name="horario" value={formData.horario} onChange={handleChange} placeholder="Horario" className="w-full p-2 border rounded" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" required />
          <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitud" className="w-full p-2 border rounded" step="any" required />
          <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitud" className="w-full p-2 border rounded" step="any" required />
          <select name="icon" value={formData.icon} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Seleccionar icono</option>
            <option value="cafe">☕ Café</option>
            <option value="sandwich">🥪 Sandwich</option>
            <option value="comida">🍽️ Comida</option>
            <option value="wok">🍜 Wok</option>
            <option value="perro caliente">🌭 Perro Caliente</option>
          </select>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
          {previewUrl && <img src={previewUrl} alt="Vista previa" className="w-full h-40 object-cover mt-2 rounded" />}
          <input type="file" accept="application/pdf" onChange={handlePdfChange} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Guardar Restaurante</button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">Proyecto institucional de <span className="font-semibold text-blue-700">La Universidad de La Sabana</span></p>
      </div>
    </div>
  );
}

export default AddRestaurant;

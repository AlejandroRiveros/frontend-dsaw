import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const foodIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

const sabanaPosition = [4.8616, -74.0336];

const restaurants = [
  { id: 'bolsa', name: 'Cafe Bolsa', position: [4.86276, -74.03334] },
  { id: 'kioskos', name: 'Kioskos', position: [4.86119, -74.03516] },
  { id: 'escuela', name: 'Restaurante Escuela', position: [4.86232, -74.03367] },
  { id: 'wok', name: 'Punto Wok', position: [4.8607, -74.03314] },
  { id: 'embarcadero', name: 'Embarcadero', position: [4.861, -74.03148] },
  { id: 'sandwich', name: 'Punto Sandwich', position: [4.86069, -74.03365] },
  { id: 'meson', name: 'El Meson', position: [4.85859, -74.0335] },
  { id: 'livinglab', name: 'Terraza Living Lab', position: [4.86243, -74.03215] },
];

const restaurantDetails = {
  'Cafe Bolsa': 'Ofrece café, snacks y postres ideales para recargar energía.',
  'Kioskos': 'Variedad de comidas rápidas y bebidas para llevar.',
  'Restaurante Escuela': 'Experiencia gourmet preparada por estudiantes de gastronomía.',
  'Punto Wok': 'Especialidades asiáticas como arroz, fideos y wok de vegetales.',
  'Embarcadero': 'Platos colombianos y comida rápida como mazorcadas y arepas.',
  'Punto Sandwich': 'Sándwiches, wraps y jugos frescos.',
  'El Meson': 'Ofrece almuerzos ejecutivos y platos tradicionales.',
  'Terraza Living Lab': 'Espacio moderno con oferta saludable y vista panorámica.',
};

function Map() {
  const navigate = useNavigate();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleRestaurantClick = (restaurantName) => {
    setSelectedRestaurant(restaurantName);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-x-hidden relative">
      {/* Leyenda lateral */}
      <div className="bg-white bg-opacity-90 p-4 m-2 rounded shadow-md w-full md:w-1/4 max-w-xs h-fit self-start z-10">
        <h2 className="font-bold mb-2">Restaurantes Universidad</h2>
        <ul>
          {restaurants.map((r) => (
            <li
              key={r.id}
              className="flex items-center mb-2 cursor-pointer hover:bg-gray-200 p-2 rounded"
              onClick={() => handleRestaurantClick(r.name)}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="icono comida" className="w-5 h-5 mr-2" />
              {r.name}
            </li>
          ))}
        </ul>
        {selectedRestaurant && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow">
            <h3 className="font-bold text-lg mb-2">{selectedRestaurant}</h3>
            <p className="text-sm text-gray-700">{restaurantDetails[selectedRestaurant]}</p>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="flex-1 min-h-[300px] md:min-h-[500px]">
        <MapContainer center={sabanaPosition} zoom={17} style={{ height: '100%', width: '100%' }} className="rounded-lg">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={restaurant.position}
              icon={foodIcon}
            >
              <Popup>
                <div className="text-center">
                  <img
                    src={`/restaurantes/${restaurant.id}.jpg`}
                    alt={restaurant.name}
                    className="w-32 h-20 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <p className="text-sm text-gray-700">{restaurantDetails[restaurant.name]}</p>
                  <a
                    href={`/menus/${restaurant.id}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-2 block"
                  >
                    Ver Menú
                  </a>
                </div>
              </Popup>
              <Tooltip direction="bottom" offset={[0, 10]} permanent>
                <span className="font-bold text-base bg-white bg-opacity-80 px-2 py-1 rounded shadow">
                  {restaurant.name}
                </span>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Botón volver */}
      <button
        onClick={() => navigate('/home-cliente')}
        className="absolute bottom-4 left-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 z-20"
      >
        Volver
      </button>
    </div>
  );
}

export default Map;

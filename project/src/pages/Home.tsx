import React from 'react';

export default function Home() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Bienvenido al Sistema de Control de Producción
      </h1>
      <p className="text-gray-600">
        Seleccione una opción del menú superior para comenzar a gestionar clientes, proveedores y ciudades.
      </p>
    </div>
  );
}
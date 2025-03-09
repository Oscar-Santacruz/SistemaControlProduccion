import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Users, Truck, MapPin, Home as HomeIcon } from 'lucide-react';
import Clientes from './pages/Clientes';
import Proveedores from './pages/Proveedores';
import Ciudades from './pages/Ciudades';
import Home from './pages/Home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                    <HomeIcon className="h-6 w-6" />
                    <span className="ml-2 font-medium">Sistema de Control de Producción</span>
                  </Link>
                </div>
                <div className="flex space-x-4">
                  <Link
                    to="/clientes"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Clientes
                  </Link>
                  <Link
                    to="/proveedores"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Proveedores
                  </Link>
                  <Link
                    to="/ciudades"
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Ciudades
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/ciudades" element={<Ciudades />} />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
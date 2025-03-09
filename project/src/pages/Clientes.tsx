import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Cliente, clientesApi, ciudadesApi } from '../lib/api';

export default function Clientes() {
  const queryClient = useQueryClient();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: clientes, isLoading: isLoadingClientes } = useQuery('clientes', () =>
    clientesApi.getAll().then((res) => res.data)
  );

  const { data: ciudades, isLoading: isLoadingCiudades } = useQuery('ciudades', () =>
    ciudadesApi.getAll().then((res) => res.data)
  );

  const createMutation = useMutation(
    (cliente: Cliente) => clientesApi.create(cliente),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clientes');
        toast.success('Cliente creado exitosamente');
        setIsModalOpen(false);
      },
      onError: () => toast.error('Error al crear el cliente'),
    }
  );

  const updateMutation = useMutation(
    ({ id, cliente }: { id: number; cliente: Cliente }) =>
      clientesApi.update(id, cliente),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clientes');
        toast.success('Cliente actualizado exitosamente');
        setIsModalOpen(false);
      },
      onError: () => toast.error('Error al actualizar el cliente'),
    }
  );

  const deleteMutation = useMutation(
    (id: number) => clientesApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clientes');
        toast.success('Cliente eliminado exitosamente');
      },
      onError: () => toast.error('Error al eliminar el cliente'),
    }
  );

  // Filtrar clientes por cualquier columna
  const filteredClientes = clientes?.filter((cliente) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      cliente.razonsocial.toLowerCase().includes(searchLower) ||
      cliente.ruc.toLowerCase().includes(searchLower) ||
      cliente.telefono.toLowerCase().includes(searchLower) ||
      cliente.email.toLowerCase().includes(searchLower) ||
      cliente.estado.toLowerCase().includes(searchLower)
    );
  });

  if (isLoadingClientes) {
    return <div>Cargando clientes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button
          onClick={() => {
            setSelectedCliente(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por razón social, RUC, teléfono, email o estado"
          className="border rounded-md px-3 py-2 flex-1"
        />
        <button
          className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
        >
          <Search className="h-5 w-5 mr-2" />
          Buscar
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Razón Social
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RUC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClientes?.map((cliente) => (
              <tr key={cliente.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.razonsocial}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.ruc}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cliente.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cliente.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCliente(cliente);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => cliente.id && deleteMutation.mutate(cliente.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const cliente: Cliente = {
                  razonsocial: formData.get('razonsocial') as string,
                  tipo_cliente: formData.get('tipo_cliente') as string,
                  ruc: formData.get('ruc') as string,
                  digveri: parseInt(formData.get('digveri') as string),
                  telefono: formData.get('telefono') as string,
                  celular: formData.get('celular') as string,
                  direccion: formData.get('direccion') as string,
                  ciudadid: parseInt(formData.get('ciudadid') as string),
                  email: formData.get('email') as string,
                  limitecuenta: parseInt(formData.get('limitecuenta') as string),
                  contacto: formData.get('contacto') as string,
                  estado: formData.get('estado') as string,
                };

                if (selectedCliente?.id) {
                  updateMutation.mutate({ id: selectedCliente.id, cliente });
                } else {
                  createMutation.mutate(cliente);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    name="razonsocial"
                    defaultValue={selectedCliente?.razonsocial}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo Cliente
                  </label>
                  <input
                    type="text"
                    name="tipo_cliente"
                    defaultValue={selectedCliente?.tipo_cliente}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    RUC
                  </label>
                  <input
                    type="text"
                    name="ruc"
                    defaultValue={selectedCliente?.ruc}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dígito Verificador
                  </label>
                  <input
                    type="number"
                    name="digveri"
                    defaultValue={selectedCliente?.digveri}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    defaultValue={selectedCliente?.telefono}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Celular
                  </label>
                  <input
                    type="text"
                    name="celular"
                    defaultValue={selectedCliente?.celular}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    defaultValue={selectedCliente?.direccion}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ciudad
                  </label>
                  <select
                    name="ciudadid"
                    defaultValue={selectedCliente?.ciudadid || ""}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccione una ciudad</option>
                    {isLoadingCiudades ? (
                      <option disabled>Cargando ciudades...</option>
                    ) : (
                      ciudades?.map((ciudad) => (
                        <option key={ciudad.id} value={ciudad.id}>
                          {ciudad.descripcion}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedCliente?.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Límite de Cuenta
                  </label>
                  <input
                    type="number"
                    name="limitecuenta"
                    defaultValue={selectedCliente?.limitecuenta}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contacto
                  </label>
                  <input
                    type="text"
                    name="contacto"
                    defaultValue={selectedCliente?.contacto}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    name="estado"
                    defaultValue={selectedCliente?.estado || "activo"}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {selectedCliente ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
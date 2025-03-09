import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Proveedor, proveedoresApi } from '../lib/api';

export default function Proveedores() {
  const queryClient = useQueryClient();
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchRuc, setSearchRuc] = useState('');

  const { data: proveedores, isLoading } = useQuery('proveedores', () =>
    proveedoresApi.getAll().then((res) => res.data)
  );

  const createMutation = useMutation(
    (proveedor: Proveedor) => proveedoresApi.create(proveedor),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('proveedores');
        toast.success('Proveedor creado exitosamente');
        setIsModalOpen(false);
      },
      onError: () => toast.error('Error al crear el proveedor'),
    }
  );

  const updateMutation = useMutation(
    ({ id, proveedor }: { id: number; proveedor: Proveedor }) =>
      proveedoresApi.update(id, proveedor),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('proveedores');
        toast.success('Proveedor actualizado exitosamente');
        setIsModalOpen(false);
      },
      onError: () => toast.error('Error al actualizar el proveedor'),
    }
  );

  const deleteMutation = useMutation(
    (id: number) => proveedoresApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('proveedores');
        toast.success('Proveedor eliminado exitosamente');
      },
      onError: () => toast.error('Error al eliminar el proveedor'),
    }
  );

  const searchByRuc = async () => {
    try {
      const response = await proveedoresApi.getByRuc(searchRuc);
      setSelectedProveedor(response.data);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Proveedor no encontrado');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
        <button
          onClick={() => {
            setSelectedProveedor(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proveedor
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchRuc}
          onChange={(e) => setSearchRuc(e.target.value)}
          placeholder="Buscar por RUC"
          className="border rounded-md px-3 py-2 flex-1"
        />
        <button
          onClick={searchByRuc}
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
                Nombre
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
            {proveedores?.map((proveedor) => (
              <tr key={proveedor.id}>
                <td className="px-6 py-4 whitespace-nowrap">{proveedor.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{proveedor.ruc}</td>
                <td className="px-6 py-4 whitespace-nowrap">{proveedor.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap">{proveedor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    proveedor.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {proveedor.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedProveedor(proveedor);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => proveedor.id && deleteMutation.mutate(proveedor.id)}
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
              {selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const proveedor: Proveedor = {
                  nombre: formData.get('nombre') as string,
                  ruc: formData.get('ruc') as string,
                  digveri: parseInt(formData.get('digveri') as string),
                  contacto: formData.get('contacto') as string,
                  telefono: formData.get('telefono') as string,
                  email: formData.get('email') as string,
                  direccion: formData.get('direccion') as string,
                  ciudad: formData.get('ciudad') as string,
                  departamento: formData.get('departamento') as string,
                  distrito: formData.get('distrito') as string,
                  pais: formData.get('pais') as string,
                  codigo_postal: formData.get('codigo_postal') as string,
                  sitio_web: formData.get('sitio_web') as string,
                  tipo: formData.get('tipo') as string,
                  moneda: formData.get('moneda') as string,
                  estado: formData.get('estado') as string,
                };

                if (selectedProveedor?.id) {
                  updateMutation.mutate({ id: selectedProveedor.id, proveedor });
                } else {
                  createMutation.mutate(proveedor);
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={selectedProveedor?.nombre}
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
                    defaultValue={selectedProveedor?.ruc}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                {/* Add more form fields here */}
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
                  {selectedProveedor ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
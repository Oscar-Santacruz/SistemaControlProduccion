import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Ciudad, ciudadesApi } from '../lib/api';

export default function Ciudades() {
  const queryClient = useQueryClient();
  const [selectedCiudad, setSelectedCiudad] = useState<Ciudad | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: ciudades, isLoading } = useQuery('ciudades', () =>
    ciudadesApi.getAll().then((res) => res. data)
  );

  const createMutation = useMutation(
    (ciudad: Ciudad) => ciudadesApi.create(ciudad),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ciudades');
        toast.success('Ciudad creada exitosamente');
        setIsModalOpen(false);
      },
      onError: () => toast.error('Error al crear la ciudad'),
    }
  );

  const updateMutation = useMutation(
    ({ id, ciudad }: { id: number; ciudad: Ciudad }) =>
      ciudadesApi.update(id, ciudad),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ciudades');
        toast.success('Ciudad actualizada exitosamente');
        setIsModalOpen(false);
      },
      onError: () => toast.error('Error al actualizar la ciudad'),
    }
  );

  const deleteMutation = useMutation(
    (id: number) => ciudadesApi.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('ciudades');
        toast.success('Ciudad eliminada exitosamente');
      },
      onError: () => toast.error('Error al eliminar la ciudad'),
    }
  );

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Ciudades</h1>
        <button
          onClick={() => {
            setSelectedCiudad(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Ciudad
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ciudades?.map((ciudad) => (
              <tr key={ciudad.id}>
                <td className="px-6 py-4 whitespace-nowrap">{ciudad.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCiudad(ciudad);
                      setIsModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => ciudad.id && deleteMutation.mutate(ciudad.id)}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedCiudad ? 'Editar Ciudad' : 'Nueva Ciudad'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const ciudad: Ciudad = {
                  descripcion: formData.get('descripcion') as string,
                };

                if (selectedCiudad?.id) {
                  updateMutation.mutate({ id: selectedCiudad.id, ciudad });
                } else {
                  createMutation.mutate(ciudad);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  defaultValue={selectedCiudad?.descripcion}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
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
                  {selectedCiudad ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
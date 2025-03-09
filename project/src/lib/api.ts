import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sistema-controlproduccion.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Cliente {
  id?: number;
  razonsocial: string;
  tipo_cliente: string;
  ruc: string;
  digveri: number;
  telefono: string;
  celular: string;
  direccion: string;
  ciudadid: number;
  email: string;
  limitecuenta: number;
  contacto: string;
  estado: string;
}

export interface Proveedor {
  id?: number;
  ruc: string;
  digveri: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  distrito: string;
  pais: string;
  codigo_postal: string;
  sitio_web: string;
  tipo: string;
  moneda: string;
  estado: string;
}

export interface Ciudad {
  id?: number;
  descripcion: string;
}

export const clientesApi = {
  getAll: () => api.get<Cliente[]>('/clientes'),
  getById: (id: number) => api.get<Cliente>(`/clientes/id/${id}`),
  getByRuc: (ruc: string) => api.get<Cliente>(`/clientes/ruc/${ruc}`),
  create: (cliente: Cliente) => api.post<Cliente>('/clientes', cliente),
  update: (id: number, cliente: Cliente) => api.put<Cliente>(`/clientes/id/${id}`, cliente),
  delete: (id: number) => api.delete(`/clientes/id/${id}`),
};

export const proveedoresApi = {
  getAll: () => api.get<Proveedor[]>('/proveedores'),
  getById: (id: number) => api.get<Proveedor>(`/proveedores/id/${id}`),
  getByRuc: (ruc: string) => api.get<Proveedor>(`/proveedores/ruc/${ruc}`),
  create: (proveedor: Proveedor) => api.post<Proveedor>('/proveedores', proveedor),
  update: (id: number, proveedor: Proveedor) => api.put<Proveedor>(`/proveedores/id/${id}`, proveedor),
  delete: (id: number) => api.delete(`/proveedores/id/${id}`),
};

export const ciudadesApi = {
  getAll: () => api.get<Ciudad[]>('/ciudades'),
  getById: (id: number) => api.get<Ciudad>(`/ciudades/id/${id}`),
  create: (ciudad: Ciudad) => api.post<Ciudad>('/ciudades', ciudad),
  update: (id: number, ciudad: Ciudad) => api.put<Ciudad>(`/ciudades/id/${id}`, ciudad),
  delete: (id: number) => api.delete(`/ciudades/id/${id}`),
};
# Sistema de Control de Producción

## Descripción

Sistema web para la gestión y control de producción empresarial. Permite administrar clientes, proveedores, ciudades y otros elementos relacionados con los procesos productivos.

## Tecnologías utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS, React Query
- **Backend**: REST API (servida desde https://sistema-controlproduccion.onrender.com)
- **Herramientas de desarrollo**: Vite, ESLint

## Funcionalidades principales

- Gestión de clientes (crear, editar, eliminar, buscar)
- Gestión de proveedores
- Gestión de ciudades
- Búsqueda intuitiva por múltiples campos
- Validación de formularios

## Instalación

### Requisitos previos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Oscar-Santacruz/SistemaControlProduccion.git
cd SistemaControlProduccion/project
```

2. Instalar dependencias:

```bash
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

4. Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

## Estructura del proyecto

```
project/
├── src/
│   ├── lib/
│   │   └── api.ts         # Configuración de APIs y tipos
│   ├── pages/
│   │   ├── Clientes.tsx   # Gestión de clientes
│   │   ├── Proveedores.tsx # Gestión de proveedores
│   │   ├── Ciudades.tsx   # Gestión de ciudades
│   │   └── Home.tsx       # Página de inicio
│   ├── App.tsx            # Componente principal y rutas
│   └── main.tsx           # Punto de entrada
├── public/                # Archivos estáticos
└── package.json           # Dependencias y scripts
```

## Cómo contribuir

1. Hacer fork del repositorio
2. Crear una rama para tu función: `git checkout -b feature/nueva-funcionalidad`
3. Hacer commit de tus cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Hacer push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir un Pull Request

## API y endpoints

El sistema utiliza una API REST cuya especificación se encuentra en el archivo `SistemaControlProduccion.yaml` (formato OpenAPI/Swagger).

Principales endpoints:
- `/clientes` - Gestión de clientes
- `/proveedores` - Gestión de proveedores
- `/ciudades` - Gestión de ciudades

## Licencia

Este proyecto está bajo la Licencia MIT.

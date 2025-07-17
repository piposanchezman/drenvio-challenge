# Sistema de Gestión de Precios Especiales

## Introducción

DrEnvio es un sistema completo de gestión de productos que permite administrar un catálogo de productos y asignar precios especiales a usuarios específicos. La aplicación está dividida en dos partes principales: un backend desarrollado con Node.js y Express, y un frontend construido con Next.js y React.

### Características principales:
- 📦 Gestión de productos con información detallada.
- 👥 Sistema de usuarios con precios especiales.
- 🔍 Búsqueda y filtrado de productos y usuarios.
- 💰 Visualización de precios regulares vs. especiales.
- 📱 Interfaz responsive, minimalista y moderna.
- 🔄 Actualizaciones de datos en tiempo real.

## Pasos para ejecutar localmente

### Prerrequisitos
- Node.js (versión 18 o superior)
- pnpm, npm o yarn

### Backend

1. **Navegar al directorio del backend:**
   ```bash
   cd Backend
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz del directorio Backend:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://drenviochallenge:m1jWly3uw42cBwp6@drenviochallenge.2efc0.mongodb.net/tienda
   
   FRONTEND_URL=http://localhost:5001
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Verificar que el servidor esté funcionando:**
   Visitar `http://localhost:5000/api/v1/health` - debería mostrar un mensaje de estado.

### Frontend

1. **Navegar al directorio del frontend:**
   ```bash
   cd Frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env.local` en la raíz del directorio Frontend:
   ```env
   PORT=5001   
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación:**
   Abrir `http://localhost:5001` en el navegador.

### Scripts disponibles

**Backend:**
- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar en modo producción

**Frontend:**
- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm start` - Ejecutar versión de producción

## Justificación de elecciones técnicas

### Backend

**Node.js + Express:**
- **Razón:** Ecosistema maduro y ampliamente adoptado para APIs REST
- **Ventajas:** Rápido desarrollo, excelente rendimiento para I/O
- **Alternativas consideradas:** NestJS (más complejo para este proyecto)

**TypeScript:**
- **Razón:** Tipado estático mejora la calidad del código y reduce errores
- **Ventajas:** Mejor experiencia de desarrollo, refactoring seguro
- **Impacto:** Reduce bugs en producción y mejora la mantenibilidad

**Express Validator:**
- **Razón:** Validación robusta y middleware integrado con Express
- **Ventajas:** Validaciones declarativas, mensajes de error personalizados
- **Impacto:** Mejora la seguridad y calidad de los datos

**Helmet + CORS:**
- **Razón:** Seguridad esencial/básica para APIs web
- **Ventajas:** Protección contra vulnerabilidades comunes, configuración simple

### Frontend

**Next.js:**
- **Razón:** Framework React con App Router para mejor rendimiento
- **Ventajas:** Renderizado del lado del servidor, optimizaciones automáticas

**TypeScript:**
- **Razón:** Consistencia con el backend y mejor experiencia de desarrollo
- **Ventajas:** Detección temprana de errores, mejor IntelliSense.

**Tailwind CSS:**
- **Razón:** Desarrollo rápido de UI con clases utilitarias
- **Ventajas:** Consistencia visual, responsive design fácil
- **Alternativas consideradas:** Styled Components (más complejo)

**Zustand:**
- **Razón:** Gestión de estado simple y ligera
- **Ventajas:** TypeScript nativo, API intuitiva

**Lucide React:**
- **Razón:** Iconos ligeros
- **Ventajas:** Diseño coherente, amplia variedad

### Arquitectura y patrones

**API REST:**
- **Razón:** Estándar ampliamente adoptado y bien documentado
- **Ventajas:** Cacheable, interfaz uniforme

**Componentes reutilizables:**
- **Razón:** Consistencia UI y mantenibilidad
- **Ejemplos:** SearchableDropdown, LoadingSpinner, Toast

## Descripción de la estructura del proyecto

### Backend (`/Backend`)

```
Backend/
├── src/
│   ├── app.ts                 # Configuración principal de Express
│   ├── index.ts              # Punto de entrada del servidor
│   ├── config/
│   │   └── database.ts       # Configuración de MongoDB
│   ├── controllers/          # Lógica de negocio
│   │   ├── productController.ts
│   │   └── specialPriceController.ts
│   ├── middleware/           # Middlewares personalizados
│   │   ├── errorHandler.ts   # Manejo centralizado de errores
│   │   └── validation.ts     # Validaciones de entrada
│   ├── models/              # Esquemas de MongoDB
│   │   ├── Products.ts
│   │   └── SpecialPrices.ts
│   ├── routes/              # Definición de rutas
│   │   ├── products.ts
│   │   └── specialPrices.ts
│   └── types/               # Definiciones de tipos TypeScript
│       └── index.ts
├── package.json
└── tsconfig.json
```

**Explicación de la estructura del Backend:**

- **`app.ts`**: Configuración central de Express con middlewares, rutas y manejo de errores
- **`config/`**: Configuraciones de servicios externos (base de datos, etc.)
- **`controllers/`**: Lógica de negocio separada por entidad, siguiendo el patrón MVC
- **`middleware/`**: Funciones que procesan requests antes de llegar a los controllers
- **`models/`**: Esquemas de datos con Mongoose, definiendo la estructura de la BD
- **`routes/`**: Definición de endpoints y asociación con controllers
- **`types/`**: Interfaces TypeScript compartidas para tipado consistente

### Frontend (`/Frontend`)

```
Frontend/
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Página de inicio (redirect)
│   │   ├── globals.css       # Estilos globales
│   │   ├── articulos/        # Página de gestión de productos
│   │   │   └── page.tsx
│   │   └── subida/           # Página de carga de precios especiales
│   │       └── page.tsx
│   ├── components/           # Componentes reutilizables
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navigation.tsx
│   │   ├── SearchableDropdown.tsx
│   │   └── Toast.tsx
│   ├── hooks/                # Custom hooks
│   │   └── useToast.ts
│   ├── lib/                  # Utilidades y configuraciones
│   │   └── api.ts            # Cliente API centralizado
│   ├── store/                # Gestión de estado global
│   │   └── useStore.ts
│   └── types/                # Definiciones de tipos
│       └── index.ts
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

**Explicación de la estructura del Frontend:**

- **`app/`**: Utiliza el nuevo App Router de Next.js 14 para routing basado en archivos
- **`components/`**: Componentes UI reutilizables con responsabilidad única
- **`hooks/`**: Lógica reutilizable encapsulada en custom hooks
- **`lib/`**: Utilidades, helpers y configuraciones (cliente API, etc.)
- **`store/`**: Estado global con Zustand para datos compartidos entre componentes
- **`types/`**: Interfaces TypeScript que coinciden con las del backend

### Flujo de datos

1. **Frontend → Backend**: Requests HTTP a través del cliente API (`lib/api.ts`)
2. **Backend → Database**: Mongoose para interactuar con MongoDB
3. **Estado Global**: Zustand gestiona el estado de productos, usuarios y precios especiales
4. **UI Updates**: React re-renderiza componentes basado en cambios de estado

### Patrones implementados

- **MVC**: Separación clara entre Models, Views y Controllers
- **Repository Pattern**: Abstracción de acceso a datos con Mongoose
- **Custom Hooks**: Encapsulación de lógica reutilizable (useToast, useStore)
- **Compound Components**: SearchableDropdown con múltiples variantes
- **Error Boundaries**: Manejo centralizado de errores en backend y frontend

Esta estructura facilita el mantenimiento, testing y escalabilidad del proyecto, siguiendo las mejores prácticas de desarrollo moderno.

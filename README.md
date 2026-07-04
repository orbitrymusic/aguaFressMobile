# TP-aguaFress

## 📝 Descripción

**aguaFress** es una solución móvil diseñada para la gestión eficiente de repartos de agua, soda y bebidas. La aplicación permite a los distribuidores mayoristas administrar su cartera de clientes, visualizar el catálogo de productos y registrar nuevos pedidos o clientes de forma ágil durante el recorrido.

- **Propósito:** Optimizar la organización del reparto mayorista y el control de la cartera de clientes en tiempo real.
- **Usuario objetivo:** Repartidores y preventistas de la distribuidora aguaFress.

---

## ✨ Funcionalidades

La aplicación cumple con los requerimientos obligatorios definidos en el Trabajo Práctico:

- **Pantalla de Inicio (RF01):** Presentación de la marca aguaFress, propósito de la herramienta y accesos directos al listado de clientes y registro.
- **Listado de Clientes (RF02):** Visualización de la cartera de clientes mayoristas mediante componentes reutilizables (`ItemCard`), mostrando información clave de cada punto de entrega.
- **Detalle de Cliente (RF03):** Información expandida del cliente seleccionado (dirección, tipo de abono, últimos pedidos) utilizando navegación dinámica por ID.
- **Formulario Controlado (RF04):** Pantalla para el alta de nuevos clientes o pedidos, con validaciones de campos obligatorios y manejo de estados mediante hooks.
- **Consumo de Datos (RF05):** Implementación de un servicio centralizado para la obtención de datos de clientes y productos (Mock/API).
- **Estados de Interfaz:** Manejo de estados de carga (_loading_), lista vacía si no hay repartos, y mensajes de error o éxito en las operaciones.

---

## 🛠️ Decisiones Técnicas

Se ha seguido la arquitectura sugerida en la Etapa 3 de la consigna para garantizar la separación de responsabilidades:

### Estructura de carpetas

- `src/app/`: Gestión de rutas y pantallas mediante **Expo Router** (Navegación basada en archivos).
- `src/components/`: Componentes UI reutilizables como `AppButton.tsx`, `ItemCard.tsx` (para las tarjetas de clientes) y `EmptyState.tsx`.
- `src/constants/`: Archivo `theme.ts` con la paleta de colores azul/celeste representativa de aguaFress y estilos base.
- `src/hooks/`: Hook personalizado `useItemForm.ts` para encapsular la lógica y validación de los formularios.
- `src/services/`: Capa de servicio `items.service.ts` encargada de las peticiones asíncronas para obtener la cartera de clientes.
- `src/types/`: Definición de interfaces de TypeScript para los modelos de `Cliente`, `Producto` y `Pedido`.

```text
AguaFress-Mobile/
├── scripts/
├── assets/
│   └── images/
└── src/
    ├── app/          # Configuración global, navegación principal o rutas (Expo Router)
    │   ├── index.tsx           (sin cambios)
    │   ├── _layout.tsx         (sin cambios)
    │   ├── login.tsx           (sin cambios)
    │   ├── catalog.tsx         (sin cambios — vista minorista)
    │   └── dashboard/
    │       ├── index.tsx       ← lista de clientes del mayorista
    │       └── [clientId].tsx  ← detalle de pedidos de un cliente
    │
    ├── components/   # Componentes visuales reutilizables (Botones, Tarjetas)
    │   ├── Button.tsx         (sin cambios)
    │   ├── ProductCard.tsx    (sin cambios)
    │   └── ClientCard.tsx      ← nuevo, tarjeta del cliente minorista
    │
    ├── services/
    │   ├── auth.service.ts     (modificar — agregar rol mayorista)
    │   ├── products.service.ts (sin cambios)
    │   └── orders.service.ts   ← nuevo, pedidos mock
    ├── types/
    │   └── index.ts            (modificar — agregar Vendor, Order)
    ├── hooks/
    │   └── useLoginForm.ts
    └── constants/
        └── theme.ts            (sin cambios)

```

### Tecnologías principales

- **React Native + Expo** (SDK 50+)
- **Expo Router** para una navegación nativa y fluida.
- **TypeScript** para un desarrollo robusto y tipado.
- **Manejo de estados:** Hooks nativos (`useState`, `useEffect`).

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AgustinSoto1307/AguaFress-Mobile.git
   cd TP-aguaFress
   Instalar dependencias:
   code
   Bash
   npm install
   Iniciar el proyecto:
   code
   Bash
   npx expo start
   Escanea el código QR con la app en tu dispositivo o presiona para abrir el emulador de Android.Expo Go
   📸 Capturas de Pantalla
   Inicio	Listado Clientes	Detalle Cliente	Formulario Alta
   ![alt text](https://via.placeholder.com/150x300?text=Home+aguaFress)
   ![alt text](https://via.placeholder.com/150x300?text=Lista+Clientes)
   ![alt text](https://via.placeholder.com/150x300?text=Detalle+Cliente)
   ![alt text](https://via.placeholder.com/150x300?text=Alta+Cliente)
   (Sustituir por capturas reales de la aplicación aguaFress antes de la entrega)
   👤 Autores
   Emiliano Spagnolo y Agustín Soto
   Carrera: Tecnicatura Superior en Desarrollo de Software Full Stack
   Materia: Aplicaciones Móviles
   Institución: ITS Cipolletti
   ```

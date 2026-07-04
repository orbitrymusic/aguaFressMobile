// ─── Roles ────────────────────────────────────────────────────────────────────

export type UserRole = 'client' | 'vendor';

// ─── Usuario base ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// ─── Cliente minorista (dueño de mercado) ─────────────────────────────────────

export interface Client extends User {
  role: 'client';
  businessName: string;  // nombre del negocio
  vendorId: string;      // mayorista asignado a este cliente
}

// ─── Vendedor mayorista ───────────────────────────────────────────────────────

export interface Vendor extends User {
  role: 'vendor';
  zone: string;          // zona de reparto
}

// ─── Producto ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

// ─── Item dentro de un pedido ─────────────────────────────────────────────────

export interface OrderItem {
  product: Product;
  quantity: number;
}

// ─── Pedido ───────────────────────────────────────────────────────────────────

export type OrderStatus = 'pendiente' | 'en camino' | 'entregado';

export interface Order {
  id: string;
  clientId: string;      // a qué cliente pertenece
  vendorId: string;      // qué mayorista lo atiende
  items: OrderItem[];    // productos y cantidades
  status: OrderStatus;
  createdAt: string;     // ISO date string
  total: number;         // precio total calculado
}

// ─── Carrito (uso temporal en la app del cliente) ─────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

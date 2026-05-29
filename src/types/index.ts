// ─── Usuario / Cliente ────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  businessName: string; // nombre del negocio (mercado, kiosco, almacén)
}

// ─── Producto ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

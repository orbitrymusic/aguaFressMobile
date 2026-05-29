import { Product } from "../types";

// ─── Mock de productos ────────────────────────────────────────────────────────
// Reemplazar por llamada a API/Supabase cuando salgas del MVP

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Bidón 20L aguaFress",
    description:
      "Agua purificada retornable. Ideal para dispensers hogareños o de oficina.",
    price: 1500,
    stock: 45,
  },
  {
    id: "2",
    title: "Sifón de Soda Ivess 1.5L",
    description: "Soda retornable con el gas perfecto para tus comidas.",
    price: 600,
    stock: 12,
  },
  {
    id: "3",
    title: "Coca-Cola 2.25L",
    description: "Gaseosa refrescante ideal para acompañar tus pedidos.",
    price: 2800,
    stock: 30,
  },
  {
    id: "4",
    title: "Bidón 12L aguaFress",
    description: "Agua purificada en envase liviano descartable.",
    price: 1100,
    stock: 0,
  },
];

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * Devuelve todos los productos disponibles.
 * Simula 600ms de latencia para disparar el estado de loading.
 */
export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS);
    }, 600);
  });
}

/**
 * Busca un producto por su ID.
 * Devuelve undefined si no existe.
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS.find((p) => p.id === id));
    }, 400);
  });
}

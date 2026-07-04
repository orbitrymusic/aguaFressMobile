import { Order, OrderStatus } from '../types';

// ─── Mock de pedidos ──────────────────────────────────────────────────────────

let MOCK_ORDERS: Order[] = [
  {
    id: 'order-001',
    clientId: 'client-001',
    vendorId: 'vendor-001',
    status: 'pendiente',
    createdAt: '2025-07-01T09:00:00Z',
    total: 4600,
    items: [
      {
        product: {
          id: '1',
          title: 'Bidón 20L aguaFress',
          description: 'Agua purificada retornable.',
          price: 1500,
          stock: 45,
        },
        quantity: 2,
      },
      {
        product: {
          id: '2',
          title: 'Sifón de Soda Ivess 1.5L',
          description: 'Soda retornable.',
          price: 600,
          stock: 12,
        },
        quantity: 1,
      },
      {
        product: {
          id: '3',
          title: 'Coca-Cola 2.25L',
          description: 'Gaseosa refrescante.',
          price: 2800,
          stock: 30,
        },
        quantity: 1,
      },
    ],
  },
  {
    id: 'order-002',
    clientId: 'client-001',
    vendorId: 'vendor-001',
    status: 'entregado',
    createdAt: '2025-06-28T11:00:00Z',
    total: 3000,
    items: [
      {
        product: {
          id: '1',
          title: 'Bidón 20L aguaFress',
          description: 'Agua purificada retornable.',
          price: 1500,
          stock: 45,
        },
        quantity: 2,
      },
    ],
  },
  {
    id: 'order-003',
    clientId: 'client-002',
    vendorId: 'vendor-001',
    status: 'pendiente',
    createdAt: '2025-07-02T08:30:00Z',
    total: 2800,
    items: [
      {
        product: {
          id: '3',
          title: 'Coca-Cola 2.25L',
          description: 'Gaseosa refrescante.',
          price: 2800,
          stock: 30,
        },
        quantity: 1,
      },
    ],
  },
  {
    id: 'order-004',
    clientId: 'client-003',
    vendorId: 'vendor-002',
    status: 'en camino',
    createdAt: '2025-07-02T10:00:00Z',
    total: 2200,
    items: [
      {
        product: {
          id: '4',
          title: 'Bidón 12L aguaFress',
          description: 'Agua purificada descartable.',
          price: 1100,
          stock: 20,
        },
        quantity: 2,
      },
    ],
  },
];

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * Devuelve todos los pedidos de un vendedor mayorista.
 * Simula 600ms de latencia de red.
 */
export async function getOrdersByVendor(vendorId: string): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ORDERS.filter((o) => o.vendorId === vendorId));
    }, 600);
  });
}

/**
 * Devuelve todos los pedidos de un cliente minorista específico.
 */
export async function getOrdersByClient(clientId: string): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ORDERS.filter((o) => o.clientId === clientId));
    }, 400);
  });
}

/**
 * Actualiza el estado de un pedido.
 * Con Supabase esto sería un UPDATE en la tabla orders.
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_ORDERS.findIndex((o) => o.id === orderId);
      if (index === -1) {
        reject(new Error('Pedido no encontrado.'));
        return;
      }
      MOCK_ORDERS[index] = { ...MOCK_ORDERS[index], status };
      resolve();
    }, 400);
  });
}

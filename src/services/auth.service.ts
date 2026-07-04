import { Client, Vendor } from '../types';

// ─── Mock de clientes minoristas ──────────────────────────────────────────────

const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-001',
    email: 'carlos@gmail.com',
    password: '1234',
    name: 'Carlos Méndez',
    role: 'client',
    businessName: 'Mercado El Sol',
    vendorId: 'vendor-001',
  },
  {
    id: 'client-002',
    email: 'ana@gmail.com',
    password: '1234',
    name: 'Ana Romero',
    role: 'client',
    businessName: 'Kiosco La Luna',
    vendorId: 'vendor-001',
  },
  {
    id: 'client-003',
    email: 'roberto@gmail.com',
    password: '1234',
    name: 'Roberto Silva',
    role: 'client',
    businessName: 'Almacén Don Roberto',
    vendorId: 'vendor-002',
  },
];

// ─── Mock de vendedores mayoristas ────────────────────────────────────────────

const MOCK_VENDORS: Vendor[] = [
  {
    id: 'vendor-001',
    email: 'juan@aguafress.com',
    password: '1234',
    name: 'Juan Pérez',
    role: 'vendor',
    zone: 'Centro',
  },
  {
    id: 'vendor-002',
    email: 'maria@aguafress.com',
    password: '1234',
    name: 'María García',
    role: 'vendor',
    zone: 'Norte',
  },
];

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * Busca el usuario en clientes y vendedores por email y password.
 * Simula 800ms de latencia de red.
 * Lanza un Error si las credenciales no coinciden.
 */
export async function login(
  email: string,
  password: string
): Promise<Client | Vendor> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();

      // Busca primero en clientes, luego en vendedores
      const user =
        MOCK_CLIENTS.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
        ) ||
        MOCK_VENDORS.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
        );

      if (!user) {
        reject(new Error('Email o contraseña incorrectos.'));
        return;
      }

      resolve(user);
    }, 800);
  });
}

/**
 * Devuelve los clientes minoristas asignados a un vendedor.
 * Útil para el dashboard del mayorista.
 */
export async function getClientsByVendor(vendorId: string): Promise<Client[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CLIENTS.filter((c) => c.vendorId === vendorId));
    }, 600);
  });
}

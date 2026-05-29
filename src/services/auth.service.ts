import { User } from "../types";

// ─── Mock de usuarios ─────────────────────────────────────────────────────────
// Reemplazar por llamada a API/Supabase cuando salgas del MVP

const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "carlos@gmail.com",
    password: "1234",
    name: "Carlos Méndez",
    businessName: "Mercado El Sol",
  },
  {
    id: "2",
    email: "ana@gmail.com",
    password: "1234",
    name: "Ana Romero",
    businessName: "Kiosco La Luna",
  },
  {
    id: "3",
    email: "roberto@gmail.com",
    password: "1234",
    name: "Roberto Silva",
    businessName: "Almacén Don Roberto",
  },
];

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * Busca un usuario por email y password.
 * Simula 800ms de latencia para disparar el estado de loading.
 * Lanza un Error con mensaje legible si las credenciales no coinciden.
 */
export async function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password,
      );

      if (!user) {
        reject(new Error("Email o contraseña incorrectos."));
        return;
      }

      resolve(user);
    }, 800);
  });
}

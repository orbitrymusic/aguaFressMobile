import { useState } from "react";
import { login } from "../services/auth.service";
import { User } from "../types";

// ─── Tipos internos del hook ──────────────────────────────────────────────────

interface LoginForm {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

interface UseLoginFormReturn {
  form: LoginForm;
  errors: LoginFormErrors;
  isLoading: boolean;
  setField: (field: keyof LoginForm, value: string) => void;
  submit: () => Promise<User | null>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Encapsula el estado y la validación del formulario de login.
 * La pantalla solo llama a setField() y submit(), sin saber nada
 * de cómo funciona la validación ni el servicio de auth.
 *
 * Uso:
 *   const { form, errors, isLoading, setField, submit } = useLoginForm();
 */
export function useLoginForm(): UseLoginFormReturn {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Actualiza un campo individual y limpia su error al escribir
  function setField(field: keyof LoginForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  // Valida los campos y devuelve true si todo está bien
  function validate(): boolean {
    const newErrors: LoginFormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Ingresá un email válido.";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (form.password.length < 4) {
      newErrors.password = "Mínimo 4 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Valida y llama al servicio. Devuelve el User si éxito, null si falla.
  async function submit(): Promise<User | null> {
    if (!validate()) return null;

    setIsLoading(true);
    try {
      const user = await login(form.email, form.password);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado.";
      setErrors({ email: message });
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { form, errors, isLoading, setField, submit };
}

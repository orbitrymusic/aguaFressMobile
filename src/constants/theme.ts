// ─── Colores ──────────────────────────────────────────────────────────────────

export const colors = {
  primary: "#00A8E8", // azul aguaFress — botones, títulos, badges
  primaryDark: "#007EA7", // azul oscuro — header de navegación
  secondary: "#00171F", // casi negro — texto principal
  background: "#F4FAFC", // fondo general de pantallas
  surface: "#FFFFFF", // fondo de tarjetas y formularios
  error: "#D90429", // rojo — errores y sin stock
  success: "#38B000", // verde — stock disponible
  gray: "#6C757D", // textos secundarios y descripciones
  border: "#E2E8F0", // líneas divisorias y bordes de inputs
  warning: "#F57F17", // amarillo — alertas informativas
};

// ─── Espaciado ────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// ─── Tipografía ───────────────────────────────────────────────────────────────

export const typography = {
  sizes: {
    caption: 12,
    body: 14,
    subtitle: 16,
    title: 20,
    display: 42,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
};

// ─── Bordes ───────────────────────────────────────────────────────────────────

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  round: 50,
};

// ─── Sombras (elevation para Android, shadow para iOS) ────────────────────────

export const shadow = {
  card: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
};

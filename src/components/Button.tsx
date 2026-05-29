import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Botón reutilizable con dos variantes: primary y outline.
 *
 * Uso:
 *   <Button label="Entrar" onPress={handleLogin} isLoading={isLoading} />
 *   <Button label="Cancelar" onPress={handleCancel} variant="outline" />
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      style={[
        styles.base,
        variant === 'primary' ? styles.primary : styles.outline,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : colors.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'outline' && styles.labelOutline,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: '#fff',
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
  },
  labelOutline: {
    color: colors.primary,
  },
});

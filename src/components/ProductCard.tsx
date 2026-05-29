import { View, Text, StyleSheet } from 'react-native';
import { Product } from '../types';
import { colors, spacing, borderRadius, typography, shadow } from '../constants/theme';
import { Button } from './Button';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tarjeta que muestra la información de un producto y permite agregarlo al pedido.
 * Se deshabilita automáticamente si el stock es 0.
 *
 * Uso:
 *   <ProductCard product={item} onAddToCart={handleAddToCart} />
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasStock = product.stock > 0;

  return (
    <View style={[styles.card, !hasStock && styles.cardDisabled]}>

      {/* Info del producto */}
      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Precio y stock en la misma fila */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${product.price.toLocaleString('es-AR')}
          </Text>
          <Text style={hasStock ? styles.stockOk : styles.stockEmpty}>
            {hasStock ? `${product.stock} u. disponibles` : 'Sin stock'}
          </Text>
        </View>
      </View>

      {/* Botón de acción */}
      <Button
        label={hasStock ? 'Agregar' : 'Sin stock'}
        onPress={() => onAddToCart(product)}
        variant={hasStock ? 'primary' : 'outline'}
        disabled={!hasStock}
      />

    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow.card,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  info: {
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
  },
  description: {
    fontSize: typography.sizes.body,
    color: colors.gray,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  price: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
  },
  stockOk: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  stockEmpty: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.error,
  },
});

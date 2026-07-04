import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Client, Order } from '../types';
import { colors, spacing, borderRadius, typography, shadow } from '../constants/theme';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ClientCardProps {
  client: Client;
  orders: Order[];
  onPress: (clientId: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPendingCount(orders: Order[]): number {
  return orders.filter((o) => o.status === 'pendiente').length;
}

function getInTransitCount(orders: Order[]): number {
  return orders.filter((o) => o.status === 'en camino').length;
}

function getLastOrderDate(orders: Order[]): string | null {
  if (orders.length === 0) return null;
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return new Date(sorted[0].createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tarjeta del cliente minorista para el dashboard del mayorista.
 * Muestra badge rojo si hay pedidos pendientes, amarillo si hay pedidos en camino.
 * Si no hay pedidos activos muestra el estado en gris.
 *
 * Uso:
 *   <ClientCard client={item} orders={clientOrders} onPress={handlePress} />
 */
export function ClientCard({ client, orders, onPress }: ClientCardProps) {
  const pendingCount = getPendingCount(orders);
  const inTransitCount = getInTransitCount(orders);
  const lastOrderDate = getLastOrderDate(orders);

  // Determina el badge más urgente a mostrar
  const showPendingBadge = pendingCount > 0;
  const showInTransitBadge = !showPendingBadge && inTransitCount > 0;
  const hasActivity = pendingCount > 0 || inTransitCount > 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(client.id)}
    >
      {/* Fila principal: info + badge */}
      <View style={styles.row}>

        {/* Avatar con inicial del negocio */}
        <View style={[styles.avatar, hasActivity && styles.avatarActive]}>
          <Text style={styles.avatarText}>
            {client.businessName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Info del cliente */}
        <View style={styles.info}>
          <Text style={styles.businessName}>{client.businessName}</Text>
          <Text style={styles.clientName}>{client.name}</Text>
          {lastOrderDate ? (
            <Text style={styles.lastOrder}>Último pedido: {lastOrderDate}</Text>
          ) : (
            <Text style={styles.noOrders}>Sin pedidos registrados</Text>
          )}
        </View>

        {/* Badge de estado */}
        <View style={styles.badgeContainer}>
          {showPendingBadge && (
            <View style={styles.badgePending}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
          {showInTransitBadge && (
            <View style={styles.badgeInTransit}>
              <Text style={styles.badgeText}>{inTransitCount}</Text>
            </View>
          )}
          {!hasActivity && orders.length > 0 && (
            <Text style={styles.allDoneText}>✓</Text>
          )}
          <Text style={styles.chevron}>›</Text>
        </View>

      </View>

      {/* Fila secundaria: resumen de pedidos */}
      {orders.length > 0 && (
        <View style={styles.summary}>
          {pendingCount > 0 && (
            <Text style={styles.summaryPending}>
              {pendingCount} {pendingCount === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
            </Text>
          )}
          {inTransitCount > 0 && (
            <Text style={styles.summaryInTransit}>
              {inTransitCount} en camino
            </Text>
          )}
          {!hasActivity && (
            <Text style={styles.summaryDone}>
              Todo entregado
            </Text>
          )}
        </View>
      )}
    </Pressable>
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
    ...shadow.card,
  },
  cardPressed: {
    opacity: 0.85,
    backgroundColor: '#F0F9FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.round,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarActive: {
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.surface,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  businessName: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
  },
  clientName: {
    fontSize: typography.sizes.body,
    color: colors.gray,
  },
  lastOrder: {
    fontSize: typography.sizes.caption,
    color: colors.gray,
    marginTop: 2,
  },
  noOrders: {
    fontSize: typography.sizes.caption,
    color: colors.border,
    marginTop: 2,
  },
  badgeContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgePending: {
    backgroundColor: colors.error,
    width: 26,
    height: 26,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInTransit: {
    backgroundColor: colors.warning,
    width: 26,
    height: 26,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
  },
  allDoneText: {
    fontSize: typography.sizes.body,
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  chevron: {
    fontSize: 22,
    color: colors.border,
    fontWeight: typography.weights.bold,
  },
  summary: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: spacing.md,
  },
  summaryPending: {
    fontSize: typography.sizes.caption,
    color: colors.error,
    fontWeight: typography.weights.semibold,
  },
  summaryInTransit: {
    fontSize: typography.sizes.caption,
    color: colors.warning,
    fontWeight: typography.weights.semibold,
  },
  summaryDone: {
    fontSize: typography.sizes.caption,
    color: colors.success,
    fontWeight: typography.weights.semibold,
  },
});

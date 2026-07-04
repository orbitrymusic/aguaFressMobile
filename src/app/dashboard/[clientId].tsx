import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography, shadow } from '../../constants/theme';
import { Order, OrderStatus } from '../../types';
import { getOrdersByClient, updateOrderStatus } from '../../services/orders.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  'en camino': 'En camino',
  entregado: 'Entregado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendiente: colors.error,
  'en camino': colors.warning,
  entregado: colors.success,
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pendiente: 'en camino',
  'en camino': 'entregado',
  entregado: null,
};

const NEXT_STATUS_LABEL: Record<OrderStatus, string | null> = {
  pendiente: 'Marcar en camino',
  'en camino': 'Marcar entregado',
  entregado: null,
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ClientOrdersScreen() {
  const router = useRouter();
  const { clientId, clientBusinessName } = useLocalSearchParams<{
    clientId: string;
    clientBusinessName: string;
  }>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [clientId]);

  async function loadOrders() {
    if (!clientId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await getOrdersByClient(clientId);
      // Pedidos pendientes primero
      const sorted = [...data].sort((a, b) => {
        const priority: Record<OrderStatus, number> = {
          pendiente: 0,
          'en camino': 1,
          entregado: 2,
        };
        return priority[a.status] - priority[b.status];
      });
      setOrders(sorted);
    } catch (err) {
      setError('No se pudieron cargar los pedidos.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(order: Order) {
    const next = NEXT_STATUS[order.status];
    const nextLabel = NEXT_STATUS_LABEL[order.status];
    if (!next || !nextLabel) return;

    Alert.alert(
      'Actualizar pedido',
      `¿Confirmar "${nextLabel}" para este pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setUpdatingId(order.id);
              await updateOrderStatus(order.id, next);
              setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
              );
            } catch (err) {
              Alert.alert('Error', 'No se pudo actualizar el pedido.');
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  }

  // ─── Render de cada pedido ─────────────────────────────────────────────────

  function renderOrder({ item }: { item: Order }) {
    const isUpdating = updatingId === item.id;
    const nextLabel = NEXT_STATUS_LABEL[item.status];
    const date = new Date(item.createdAt).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return (
      <View style={styles.orderCard}>

        {/* Encabezado del pedido */}
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Pedido #{item.id.split('-')[1]}</Text>
            <Text style={styles.orderDate}>{date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
            <Text style={styles.statusText}>{STATUS_LABELS[item.status]}</Text>
          </View>
        </View>

        {/* Lista de productos del pedido */}
        <View style={styles.itemsList}>
          {item.items.map((orderItem, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productQty}>×{orderItem.quantity}</Text>
              <Text style={styles.productTitle} numberOfLines={1}>
                {orderItem.product.title}
              </Text>
              <Text style={styles.productSubtotal}>
                ${(orderItem.product.price * orderItem.quantity).toLocaleString('es-AR')}
              </Text>
            </View>
          ))}
        </View>

        {/* Total del pedido */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total del pedido</Text>
          <Text style={styles.totalValue}>
            ${item.total.toLocaleString('es-AR')}
          </Text>
        </View>

        {/* Botón para avanzar el estado — solo si no está entregado */}
        {nextLabel && (
          <Pressable
            style={[
              styles.statusButton,
              { borderColor: STATUS_COLORS[NEXT_STATUS[item.status]!] },
              isUpdating && styles.statusButtonDisabled,
            ]}
            onPress={() => handleStatusChange(item)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[
                styles.statusButtonText,
                { color: STATUS_COLORS[NEXT_STATUS[item.status]!] },
              ]}>
                {nextLabel}
              </Text>
            )}
          </Pressable>
        )}

      </View>
    );
  }

  // ─── Estados de UI ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Totales para el resumen
  const pendingOrders = orders.filter((o) => o.status === 'pendiente');
  const pendingTotal = pendingOrders.reduce((sum, o) => sum + o.total, 0);

  // ─── Pantalla principal ─────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* Resumen del cliente */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryBusiness}>{clientBusinessName}</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{orders.length}</Text>
            <Text style={styles.summaryLabel}>pedidos totales</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, pendingOrders.length > 0 && styles.summaryNumberAlert]}>
              {pendingOrders.length}
            </Text>
            <Text style={styles.summaryLabel}>pendientes</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              ${pendingTotal.toLocaleString('es-AR')}
            </Text>
            <Text style={styles.summaryLabel}>a cobrar</Text>
          </View>
        </View>
      </View>

      {/* Lista de pedidos */}
      {orders.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Este cliente no tiene pedidos aún.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.body,
    color: colors.primaryDark,
  },
  errorText: {
    fontSize: typography.sizes.body,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.body,
    color: colors.gray,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.primaryDark,
    padding: spacing.md,
    gap: spacing.sm,
  },
  summaryBusiness: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
    color: '#fff',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryNumber: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: '#fff',
  },
  summaryNumberAlert: {
    color: '#FFB3B3',
  },
  summaryLabel: {
    fontSize: typography.sizes.caption,
    color: '#A8D8EA',
  },
  summaryDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  list: {
    padding: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadow.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: typography.sizes.subtitle,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
  },
  orderDate: {
    fontSize: typography.sizes.caption,
    color: colors.gray,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: '#fff',
  },
  itemsList: {
    gap: spacing.xs,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  productQty: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
    width: 28,
  },
  productTitle: {
    flex: 1,
    fontSize: typography.sizes.body,
    color: colors.secondary,
  },
  productSubtotal: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: colors.secondary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.sizes.body,
    color: colors.gray,
    fontWeight: typography.weights.medium,
  },
  totalValue: {
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
  },
  statusButton: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  statusButtonDisabled: {
    opacity: 0.6,
  },
  statusButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
});

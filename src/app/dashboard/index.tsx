import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, typography } from '../../constants/theme';
import { Client, Order } from '../../types';
import { getClientsByVendor } from '../../services/auth.service';
import { getOrdersByVendor } from '../../services/orders.service';
import { ClientCard } from '../../components/ClientCard';
import { Button } from '../../components/Button';

export default function DashboardScreen() {
  const router = useRouter();
  const { vendorId, vendorName } = useLocalSearchParams<{
    vendorId: string;
    vendorName: string;
  }>();

  const [clients, setClients] = useState<Client[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!vendorId) return;
      try {
        setIsLoading(true);
        setError(null);

        // Cargamos clientes y pedidos en paralelo
        const [clientsData, ordersData] = await Promise.all([
          getClientsByVendor(vendorId),
          getOrdersByVendor(vendorId),
        ]);

        // Ordenamos: primero los que tienen pedidos pendientes
        const sorted = [...clientsData].sort((a, b) => {
          const aPending = ordersData.filter(
            (o) => o.clientId === a.id && o.status === 'pendiente'
          ).length;
          const bPending = ordersData.filter(
            (o) => o.clientId === b.id && o.status === 'pendiente'
          ).length;
          return bPending - aPending;
        });

        setClients(sorted);
        setOrders(ordersData);
      } catch (err) {
        setError('No se pudo cargar la cartera de clientes.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [vendorId]);

  function handleClientPress(clientId: string) {
    const client = clients.find((c) => c.id === clientId);
    router.push({
      pathname: '/dashboard/[clientId]',
      params: {
        clientId,
        clientBusinessName: client?.businessName ?? '',
        vendorId: vendorId ?? '',
      },
    });
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Querés salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  }

  // Calcula cuántos pedidos pendientes hay en total
  const totalPending = orders.filter((o) => o.status === 'pendiente').length;

  // ─── Estados de UI ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando cartera de clientes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.retryButton}>
          <Button label="Reintentar" onPress={() => router.replace('/dashboard')} />
        </View>
      </View>
    );
  }

  // ─── Pantalla principal ─────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* Barra superior */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.vendorName}>{vendorName}</Text>
        </View>
        <Button label="Salir" onPress={handleLogout} variant="outline" />
      </View>

      {/* Resumen de actividad */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
        </Text>
        {totalPending > 0 && (
          <View style={styles.pendingPill}>
            <Text style={styles.pendingPillText}>
              {totalPending} {totalPending === 1 ? 'pedido pendiente' : 'pedidos pendientes'}
            </Text>
          </View>
        )}
        {totalPending === 0 && (
          <Text style={styles.allClearText}>✓ Todo al día</Text>
        )}
      </View>

      {/* Lista de clientes */}
      {clients.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            No tenés clientes asignados aún.
          </Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClientCard
              client={item}
              orders={orders.filter((o) => o.clientId === item.id)}
              onPress={handleClientPress}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
}

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
    marginBottom: spacing.md,
  },
  retryButton: {
    width: 160,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  greeting: {
    fontSize: typography.sizes.caption,
    color: colors.gray,
  },
  vendorName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryDark,
  },
  summaryText: {
    fontSize: typography.sizes.body,
    color: '#fff',
    fontWeight: typography.weights.medium,
  },
  pendingPill: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  pendingPillText: {
    fontSize: typography.sizes.caption,
    color: '#fff',
    fontWeight: typography.weights.bold,
  },
  allClearText: {
    fontSize: typography.sizes.caption,
    color: '#A8F0C6',
    fontWeight: typography.weights.semibold,
  },
  list: {
    padding: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.body,
    color: colors.gray,
    textAlign: 'center',
  },
});

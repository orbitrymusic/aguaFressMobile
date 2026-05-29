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
import { colors, spacing, typography } from '../constants/theme';
import { getProducts } from '../services/products.service';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product } from '../types';

export default function CatalogScreen() {
  const router = useRouter();
  const { userName, businessName } = useLocalSearchParams<{
    userName: string;
    businessName: string;
  }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('No se pudo cargar el catálogo. Intentá de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  function handleAddToCart(product: Product) {
    setCartCount((prev) => prev + 1);
    Alert.alert('Agregado', `${product.title} fue agregado al pedido.`);
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

  // ─── Estados de UI ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.retryButton}>
          <Button label="Reintentar" onPress={() => router.replace('/catalog')} />
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
          <Text style={styles.greeting}>Hola, {userName}</Text>
          <Text style={styles.businessName}>{businessName}</Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.cartBadge}>🛒 {cartCount}</Text>
          <Button
            label="Salir"
            onPress={handleLogout}
            variant="outline"
          />
        </View>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={handleAddToCart} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

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
  businessName: {
    fontSize: typography.sizes.body,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartBadge: {
    fontSize: typography.sizes.body,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  list: {
    padding: spacing.md,
  },
});

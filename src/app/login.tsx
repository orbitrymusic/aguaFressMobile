import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import { useLoginForm } from '../hooks/useLoginForm';
import { Button } from '../components/Button';
import { Client, Vendor } from '../types';

export default function LoginScreen() {
  const router = useRouter();
  const { form, errors, isLoading, setField, submit } = useLoginForm();

  async function handleLogin() {
    const user = await submit();
    if (!user) return;

    if (user.role === 'client') {
      const client = user as Client;
      router.replace({
        pathname: '/catalog',
        params: {
          userName: client.name,
          businessName: client.businessName,
        },
      });
    } else {
      const vendor = user as Vendor;
      router.replace({
        pathname: '/dashboard',
        params: {
          vendorId: vendor.id,
          vendorName: vendor.name,
        },
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Marca */}
        <View style={styles.header}>
          <Text style={styles.brand}>aguaFress</Text>
          <Text style={styles.brandSub}>Distribución mayorista</Text>
        </View>

        {/* Formulario */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ingresar</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="tu@email.com"
            placeholderTextColor={colors.gray}
            value={form.email}
            onChangeText={(v) => setField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <Text style={[styles.label, styles.labelSpacing]}>Contraseña</Text>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            placeholder="••••••••"
            placeholderTextColor={colors.gray}
            value={form.password}
            onChangeText={(v) => setField('password', v)}
            secureTextEntry
            editable={!isLoading}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          <View style={styles.buttonWrapper}>
            <Button
              label="Entrar"
              onPress={handleLogin}
              isLoading={isLoading}
            />
          </View>
        </View>

        {/* Cuentas de prueba */}
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Cuentas de prueba · pass: 1234</Text>
          <Text style={styles.hintLabel}>Clientes:</Text>
          <Text style={styles.hintText}>carlos@gmail.com</Text>
          <Text style={styles.hintText}>ana@gmail.com</Text>
          <Text style={styles.hintText}>roberto@gmail.com</Text>
          <Text style={[styles.hintLabel, { marginTop: spacing.xs }]}>Mayoristas:</Text>
          <Text style={styles.hintText}>juan@aguafress.com</Text>
          <Text style={styles.hintText}>maria@aguafress.com</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
  },
  brand: {
    fontSize: typography.sizes.display,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: -1,
  },
  brandSub: {
    fontSize: typography.sizes.caption,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: typography.sizes.title,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sizes.body,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  labelSpacing: {
    marginTop: spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.body,
    color: colors.secondary,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.sizes.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  buttonWrapper: {
    marginTop: spacing.lg,
  },
  hint: {
    backgroundColor: '#FFF8E1',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FFE082',
    gap: 4,
  },
  hintTitle: {
    fontSize: typography.sizes.caption,
    fontWeight: 'bold',
    color: colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hintLabel: {
    fontSize: typography.sizes.caption,
    fontWeight: 'bold',
    color: '#795548',
  },
  hintText: {
    fontSize: typography.sizes.caption,
    color: '#795548',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    paddingLeft: spacing.sm,
  },
});

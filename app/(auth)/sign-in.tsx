import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import AuthField from "../../components/AuthField";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../lib/authValidation";
import { authStyles } from "../../styles/authStyles";

// Layar masuk (route "/sign-in")
export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false); // kunci sinkron: mencegah submit ganda sebelum state sempat ter-render

  const handleSignIn = async () => {
    if (submitting.current) return; // cegah submit ganda

    const cleanEmail = email.trim(); // buang spasi tak terlihat dari autocomplete
    const nextEmailError = validateEmail(cleanEmail);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);
    if (nextEmailError || nextPasswordError) return;

    submitting.current = true;
    setLoading(true);
    try {
      const { error } = await signIn(cleanEmail, password);
      // Sukses: tidak ada navigasi manual. Guard di app/_layout.tsx melihat session
      // terisi lalu memindahkan pengguna keluar dari layar auth.
      if (error) setFormError(error);
    } catch {
      setFormError("Terjadi kesalahan. Periksa koneksi lalu coba lagi.");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      style={authStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView
        contentContainerStyle={authStyles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authStyles.card}>
          <Text style={authStyles.title}>Masuk</Text>
          <Text style={authStyles.subtitle}>
            Masuk untuk menyimpan film favoritmu.
          </Text>

          <AuthField
            label="EMAIL"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <AuthField
            label="KATA SANDI"
            placeholder="Minimal 6 karakter"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            isPassword
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            onSubmitEditing={handleSignIn}
          />

          {formError ? (
            <View style={authStyles.formError}>
              <Text style={authStyles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

          <Pressable
            style={[authStyles.button, loading && authStyles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            accessibilityRole="button"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={authStyles.buttonText}>Masuk</Text>
            )}
          </Pressable>

          <View style={authStyles.switchRow}>
            <Text style={authStyles.switchText}>Belum punya akun? </Text>
            <Pressable
              onPress={() => router.replace("/sign-up")}
              disabled={loading}
              accessibilityRole="link"
            >
              <Text style={authStyles.switchLink}>Daftar di sini</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
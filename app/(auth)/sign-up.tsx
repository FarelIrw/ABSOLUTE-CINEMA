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
import {
  validateCallsign,
  validateEmail,
  validatePassword,
} from "../../lib/authValidation";
import { authStyles } from "../../styles/authStyles";

// Layar daftar (route "/sign-up")
export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [callsign, setCallsign] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callsignError, setCallsignError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false); // kunci sinkron: mencegah submit ganda sebelum state sempat ter-render

  const handleSignUp = async () => {
    if (submitting.current) return; // cegah submit ganda

    const cleanCallsign = callsign.trim();
    const cleanEmail = email.trim();
    const nextCallsignError = validateCallsign(cleanCallsign);
    const nextEmailError = validateEmail(cleanEmail);
    const nextPasswordError = validatePassword(password);
    setCallsignError(nextCallsignError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);
    if (nextCallsignError || nextEmailError || nextPasswordError) return;

    submitting.current = true;
    setLoading(true);
    try {
      const { error } = await signUp(cleanEmail, password, cleanCallsign);
      // Sukses: tidak ada navigasi manual. Guard di app/_layout.tsx memindahkan pengguna.
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
          <Text style={authStyles.title}>Daftar</Text>
          <Text style={authStyles.subtitle}>
            Buat akun baru untuk mulai menyimpan film favorit.
          </Text>

          <AuthField
            label="NAMA PANGGILAN"
            placeholder="Contoh: Kuro"
            value={callsign}
            onChangeText={setCallsign}
            error={callsignError}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
          />
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
            onSubmitEditing={handleSignUp}
          />

          {formError ? (
            <View style={authStyles.formError}>
              <Text style={authStyles.formErrorText}>{formError}</Text>
            </View>
          ) : null}

          <Pressable
            style={[authStyles.button, loading && authStyles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            accessibilityRole="button"
            accessibilityState={{ disabled: loading, busy: loading }}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={authStyles.buttonText}>Daftar</Text>
            )}
          </Pressable>

          <View style={authStyles.switchRow}>
            <Text style={authStyles.switchText}>Sudah punya akun? </Text>
            <Pressable
              onPress={() => router.replace("/sign-in")}
              disabled={loading}
              accessibilityRole="link"
            >
              <Text style={authStyles.switchLink}>Masuk di sini</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
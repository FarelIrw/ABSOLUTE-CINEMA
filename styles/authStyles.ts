import { StyleSheet } from "react-native";

// Warna mengikuti tema app (sama dengan navStyles / exploreStyles)
export const AUTH = {
  bg: "#0f0f14",
  surface: "#1a1a24",
  border: "#2a2a38",
  muted: "#a0a0b0",
  text: "#ffffff",
  error: "#f87171",
  errorBg: "#2a1a1f",
};

// External style: dipakai layar app/(auth)/*, components/AuthField.tsx, dan tab Profil
export const authStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AUTH.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 56,
    left: 20,
    zIndex: 1,
    padding: 4,
  },
  card: {
    backgroundColor: AUTH.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AUTH.border,
    padding: 20,
  },
  title: {
    color: AUTH.text,
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: AUTH.muted,
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 20,
  },

  // Satu kolom isian (label + input + pesan error)
  field: {
    marginBottom: 14,
  },
  label: {
    color: AUTH.muted,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AUTH.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AUTH.border,
    paddingHorizontal: 12,
  },
  inputWrapError: {
    borderColor: AUTH.error,
  },
  input: {
    flex: 1,
    color: AUTH.text,
    fontSize: 15,
    paddingVertical: 12,
  },
  fieldError: {
    color: AUTH.error,
    fontSize: 12,
    marginTop: 4,
  },

  // Pesan error dari server (mis. kata sandi salah)
  formError: {
    backgroundColor: AUTH.errorBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AUTH.error,
    padding: 12,
    marginBottom: 14,
  },
  formErrorText: {
    color: AUTH.error,
    fontSize: 13,
  },

  // Tombol utama (putih) dan sekunder (garis tepi)
  button: {
    backgroundColor: AUTH.text,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: AUTH.border,
  },
  buttonOutlineText: {
    color: AUTH.text,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  switchText: {
    color: AUTH.muted,
    fontSize: 13,
  },
  switchLink: {
    color: AUTH.text,
    fontSize: 13,
    fontWeight: "700",
  },

  // Tab Profil
  profileBody: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120, // ruang untuk navbar melayang
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 12,
  },
  profileName: {
    color: AUTH.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  profileEmail: {
    color: AUTH.muted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  profileEmpty: {
    color: AUTH.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
});
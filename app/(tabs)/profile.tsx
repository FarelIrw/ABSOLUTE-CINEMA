import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { AUTH, authStyles } from "../../styles/authStyles";
import { exploreStyles } from "../../styles/exploreStyles";

// Tab profile (route "/profile"): menampilkan akun yang sedang masuk + tombol keluar.
// Layar ini hanya bisa dibuka setelah login (dijaga di app/_layout.tsx).
export default function Screen() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return; // cegah klik ganda
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={exploreStyles.container}>
      <View style={exploreStyles.header}>
        <Text style={exploreStyles.title}>Profil</Text>
      </View>

      <ScrollView contentContainerStyle={authStyles.profileBody}>
        {user && (
          <View style={authStyles.card}>
            <Ionicons
              name="person-circle-outline"
              size={72}
              color={AUTH.muted}
              style={authStyles.avatar}
            />
            <Text style={authStyles.profileName}>{user.callsign}</Text>
            <Text style={authStyles.profileEmail}>{user.email}</Text>

            <Pressable
              style={[
                authStyles.button,
                authStyles.buttonOutline,
                signingOut && authStyles.buttonDisabled,
              ]}
              onPress={handleSignOut}
              disabled={signingOut}
              accessibilityRole="button"
              accessibilityState={{ disabled: signingOut, busy: signingOut }}
            >
              {signingOut ? (
                <ActivityIndicator color={AUTH.text} />
              ) : (
                <Text style={[authStyles.buttonText, authStyles.buttonOutlineText]}>
                  Keluar
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
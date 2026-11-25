import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import { AUTH, authStyles } from "../styles/authStyles";

interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  isPassword?: boolean; // true: teks disembunyikan + tombol mata
}

// Satu kolom isian form auth: label, input, dan pesan error di bawahnya.
// Props TextInput lain (keyboardType, autoCapitalize, dll.) diteruskan apa adanya.
export default function AuthField({
  label,
  error,
  isPassword = false,
  ...inputProps
}: AuthFieldProps) {
  const [hidden, setHidden] = useState(true);

  return (
    <View style={authStyles.field}>
      <Text style={authStyles.label}>{label}</Text>
      <View style={[authStyles.inputWrap, error ? authStyles.inputWrapError : null]}>
        <TextInput
          style={authStyles.input}
          placeholderTextColor={AUTH.muted}
          secureTextEntry={isPassword && hidden}
          {...inputProps}
        />
        {isPassword && (
          <Pressable
            onPress={() => setHidden((prev) => !prev)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Tampilkan kata sandi" : "Sembunyikan kata sandi"}
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={AUTH.muted}
            />
          </Pressable>
        )}
      </View>
      {error ? <Text style={authStyles.fieldError}>{error}</Text> : null}
    </View>
  );
}
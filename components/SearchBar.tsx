import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";
import { searchStyles } from "../styles/searchStyle";

// Warna pengganti jika SEARCH belum didefinisikan di file style
const SEARCH = { muted: "#a0a0b0" };

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

// Kotak pencarian: ikon kaca pembesar, input, dan tombol hapus (muncul saat ada teks)
export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Cari judul, genre, atau tahun...",
}: SearchBarProps) {
  return (
    <View style={searchStyles.wrap}>
      <Ionicons name="search" size={18} color={SEARCH.muted} />

      <TextInput
        style={searchStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={SEARCH.muted}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Cari film"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian"
        >
          <Ionicons name="close-circle" size={18} color={SEARCH.muted} />
        </Pressable>
      )}
    </View>
  );
}

// Tampilan saat hasil pencarian kosong (dipakai di ListEmptyComponent)
export function SearchEmpty({ query }: { query: string }) {
  return (
    <View style={searchStyles.empty}>
      <Ionicons name="film-outline" size={48} color={SEARCH.muted} />
      <Text style={searchStyles.emptyTitle}>Film tidak ditemukan</Text>
      <Text style={searchStyles.emptyText}>
        Tidak ada hasil untuk "{query}". Coba kata kunci lain, misalnya judul,
        genre, atau tahun rilis.
      </Text>
    </View>
  );
}
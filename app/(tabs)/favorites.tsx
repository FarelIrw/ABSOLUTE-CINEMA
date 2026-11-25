import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useMovies } from "../../context/MoviesContext";
import { supabase } from "../../lib/supabase";
import { exploreStyles } from "../../styles/exploreStyles";

interface FavoriteRow {
  movie_id: number;
  created_at: string;
}

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { allMovies, details } = useMovies();

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchFavorites = useCallback(
    async (isRefresh = false) => {
      if (!user) {
        setFavoriteIds([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMsg(null);

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("movie_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          setErrorMsg("Gagal memuat daftar favorit.");
          return;
        }

        const rows = (data ?? []) as FavoriteRow[];
        setFavoriteIds(rows.map((row) => Number(row.movie_id)));
      } catch {
        setErrorMsg("Terjadi kesalahan jaringan saat memuat favorit.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  // Muat ulang setiap kali tab Favorites dibuka agar perubahan dari halaman detail langsung terlihat
  useFocusEffect(
    useCallback(() => {
      fetchFavorites(false);
    }, [fetchFavorites])
  );

  const favoriteMovies = useMemo(() => {
    const movieMap = new Map(allMovies.map((m) => [m.id, m]));
    return favoriteIds
      .map((id) => movieMap.get(id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [allMovies, favoriteIds]);

  const handleRemoveFavorite = async (movieId: number) => {
    if (!user || removingId === movieId) return;

    const previousIds = favoriteIds;
    setRemovingId(movieId);
    setErrorMsg(null);
    // Optimistic UI: hapus langsung dari daftar
    setFavoriteIds((prev) => prev.filter((id) => id !== movieId));

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

      if (error) {
        // Rollback jika gagal
        setFavoriteIds(previousIds);
        setErrorMsg("Gagal menghapus film dari favorit.");
      }
    } catch {
      setFavoriteIds(previousIds);
      setErrorMsg("Terjadi kesalahan saat menghapus favorit.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[exploreStyles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.hintText}>Memuat daftar favorit...</Text>
      </View>
    );
  }

  return (
    <View style={[exploreStyles.container, styles.screen]}>
      <Text style={styles.heading}>Favorit Saya</Text>
      <Text style={styles.subheading}>
        {user ? `Akun: ${user.callsign}` : "Masuk untuk menyimpan favorit"}
      </Text>

      {errorMsg ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <FlatList
        data={favoriteMovies}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={
          favoriteMovies.length === 0 ? styles.emptyContainer : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchFavorites(true)}
            tintColor="#ffffff"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>Belum ada film favorit</Text>
            <Text style={styles.hintText}>
              Buka detail film lalu tambahkan ke favorit untuk menyimpannya ke akunmu.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.cardMain}
              onPress={() =>
                router.push({
                  pathname: "/movie/[id]",
                  params: { id: String(item.id) },
                })
              }
            >
              {details[item.id]?.posterUrl ? (
                <Image
                  source={{ uri: details[item.id].posterUrl as string }}
                  style={styles.poster}
                />
              ) : (
                <View style={[styles.poster, styles.posterPlaceholder]}>
                  <Text style={styles.placeholderText}>NO IMG</Text>
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.meta}>
                  {item.year ?? "-"} • {item.genre.length > 0 ? item.genre.join(", ") : "Film"}
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.removeBtn,
                removingId === item.id && styles.disabledBtn,
              ]}
              onPress={() => handleRemoveFavorite(item.id)}
              disabled={removingId === item.id}
            >
              {removingId === item.id ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.removeBtnText}>Hapus</Text>
              )}
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  subheading: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 96,
    gap: 12,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 96,
  },
  emptyBox: {
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 6,
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  hintText: {
    color: "#a1a1aa",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 13,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#181820",
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  poster: {
    width: 52,
    height: 76,
    borderRadius: 8,
    backgroundColor: "#272733",
  },
  posterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#a1a1aa",
    fontSize: 10,
    fontWeight: "600",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    color: "#a1a1aa",
    fontSize: 12,
  },
  removeBtn: {
    backgroundColor: "#2b2b38",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 68,
    alignItems: "center",
  },
  removeBtnText: {
    color: "#f87171",
    fontSize: 12,
    fontWeight: "600",
  },
  disabledBtn: {
    opacity: 0.6,
  },
});
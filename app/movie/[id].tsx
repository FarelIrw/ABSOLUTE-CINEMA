import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useMovies } from "../../context/MoviesContext";
import { formatDuration } from "../../functions/movieUtils";
import { supabase } from "../../lib/supabase";
import { detailStyles as s } from "../../styles/detailStyles";

// Layar detail (route "/movie/:id"), mis. /movie/3
export default function MovieDetail() {
  const router = useRouter();
  const { allMovies, details } = useMovies();
  const { session, user } = useAuth();

  // [id] pada nama file -> dibaca lewat useLocalSearchParams (selalu bertipe string)
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = allMovies.findIndex((m) => String(m.id) === id);
  const movie = allMovies[index];

  const [liked, setLiked] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const togglingRef = useRef(false);

  // Sinkronkan status favorit dari Supabase saat film atau user berubah
  useEffect(() => {
    let ignore = false;

    async function syncFavoriteStatus() {
      if (!user || !movie) {
        if (!ignore) setLiked(false);
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", movie.id)
        .maybeSingle();

      if (!ignore && !error) {
        setLiked(Boolean(data));
      }
    }

    syncFavoriteStatus();
    return () => {
      ignore = true;
    };
  }, [user, movie]);

  // Tombol hati: tamu diarahkan ke layar masuk, pengguna yang sudah login menyimpan ke Supabase
  const handleFavorite = async () => {
    if (!movie) return;

    if (!session || !user) {
      router.push("/sign-in");
      return;
    }

    if (togglingRef.current) return;
    togglingRef.current = true;
    setSavingFavorite(true);

    const nextLiked = !liked;
    setLiked(nextLiked); // Optimistic UI

    try {
      if (nextLiked) {
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          movie_id: movie.id,
        });
        if (error) setLiked(!nextLiked); // Rollback jika gagal
      } else {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie.id);
        if (error) setLiked(!nextLiked); // Rollback jika gagal
      }
    } catch {
      setLiked(!nextLiked);
    } finally {
      togglingRef.current = false;
      setSavingFavorite(false);
    }
  };

  // Tombol kembali. canGoBack() false jika layar ini dibuka langsung (mis. dari link),
  // tidak ada layar sebelumnya, maka diganti ke Beranda.
  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (!movie) {
    return (
      <View style={[s.container, s.notFound]}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Film tidak ditemukan</Text>
        <Pressable
          onPress={goBack}
          style={[s.button, { marginTop: 16, paddingHorizontal: 24 }]}
        >
          <Text style={s.buttonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const posterUrl = details[movie.id]?.posterUrl;
  const next = allMovies[(index + 1) % allMovies.length]; // film berikutnya (melingkar)

  return (
    <View style={s.container}>
      <ScrollView contentContainerStyle={s.content}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={s.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={s.posterPlaceholder}>
            <Text style={s.posterPlaceholderText}>{movie.title}</Text>
          </View>
        )}

        <View style={s.body}>
          <Text style={s.title}>{movie.title}</Text>
          <Text style={s.meta}>
            {movie.year} • {formatDuration(movie.duration)}
          </Text>
          <Text
            style={[
              s.rating,
              { color: movie.rating > 8 ? "#22c55e" : "#facc15" },
            ]}
          >
            ⭐ {movie.rating}
          </Text>

          <View style={s.genreRow}>
            {movie.genre.map((g) => (
              <Pressable
                key={g}
                style={s.genreChip}
                // navigate() + params: ke tab Jelajah dengan filter genre terpilih
                onPress={() =>
                  router.navigate({ pathname: "/explore", params: { genre: g } })
                }
              >
                <Text style={s.genreText}>{g}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={s.synopsis}>{movie.synopsis}</Text>

          <View style={s.actions}>
            {/* push(): menumpuk layar detail baru; tekan Kembali untuk mundur satu per satu */}
            <Pressable
              style={s.button}
              onPress={() => router.push(`/movie/${next.id}`)}
            >
              <Text style={s.buttonText}>Film berikutnya: {next.title}</Text>
            </Pressable>

            {/* back(): kembali ke layar sebelumnya */}
            <Pressable style={[s.button, s.buttonGhost]} onPress={goBack}>
              <Text style={[s.buttonText, s.buttonGhostText]}>Kembali</Text>
            </Pressable>

            {/* replace(): mengganti layar ini dengan Beranda (tidak bisa back ke sini) */}
            <Pressable
              style={[s.button, s.buttonGhost]}
              onPress={() => router.replace("/")}
            >
              <Text style={[s.buttonText, s.buttonGhostText]}>Ke Beranda</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Pressable
        style={s.backButton}
        onPress={goBack}
        hitSlop={8}
        accessibilityLabel="Kembali"
      >
        <Ionicons name="arrow-back" size={22} color="#ffffff" />
      </Pressable>

      <Pressable
        style={s.favoriteButton}
        onPress={handleFavorite}
        disabled={savingFavorite}
        hitSlop={8}
        accessibilityLabel={
          liked ? "Hapus dari favorit" : "Tambah ke favorit"
        }
      >
        {savingFavorite ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Ionicons
            name={session && liked ? "heart" : "heart-outline"}
            size={22}
            color={session && liked ? "#f87171" : "#ffffff"}
          />
        )}
      </Pressable>
    </View>
  );
}
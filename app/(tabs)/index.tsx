import { useRouter } from "expo-router";
import HomeScreen from "../../components/HomeScreen";
import { useMovies } from "../../context/MoviesContext";

// Tab Beranda (route "/")
export default function Home() {
  const router = useRouter();
  const { allMovies, details } = useMovies();

  return (
    <HomeScreen
      movies={allMovies}
      details={details}
      // pindah tab -> navigate()
      onSeeAll={() => router.navigate("/explore")}
      // buka detail -> push() menumpuk layar baru, bisa kembali dengan back()
      onMoviePress={(movie) => router.push(`/movie/${movie.id}`)}
    />
  );
}

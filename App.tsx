import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import {
  getMoviesByGenre,
  formatDuration,
  getAverageRating,
  Movie,
} from './functions/movieUtils';

const movies: Movie[] = [
  {
    title: 'Avengers',
    genre: 'Action',
    rating: 8.5,
    duration: 143,
  },
  {
    title: 'Frozen',
    genre: 'Animation',
    rating: 8.0,
    duration: 102,
  },
  {
    title: 'John Wick',
    genre: 'Action',
    rating: 9.0,
    duration: 131,
  },
];

export default function App() {
  // Mengambil film dengan genre Action
  const actionMovies = getMoviesByGenre(movies, 'Action');

  // Menghitung rata-rata rating
  const averageRating = getAverageRating(movies);

  // Mengubah 135 menit menjadi format jam dan menit
  const duration = formatDuration(135);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Movie Utility</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Film Genre Action</Text>

        {actionMovies.map((movie) => (
          <Text style={styles.text} key={movie.title}>
            • {movie.title}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>⏱ Format Durasi</Text>

        <Text style={styles.text}>
          135 menit → {duration}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>⭐ Rata-rata Rating</Text>

        <Text style={styles.rating}>
          {averageRating.toFixed(1)}
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
  },

  rating: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

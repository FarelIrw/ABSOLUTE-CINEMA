export type Genre =
  | "Action"
  | "Animation"
  | "Drama"
  | "Horror"
  | "Sci-Fi"
  | "Thriller";

export type Movie = {
  id: number;
  title: string;
  genre: Genre[];
  year: number;
  rating: number; // skala 0-10
  duration: number; // dalam menit
  synopsis: string;
};
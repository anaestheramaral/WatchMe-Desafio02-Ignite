import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";


interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesProviderProps {
  children: ReactNode
};

interface MoviesAndGenresData {
  movies: MovieProps[],
  genres: GenreResponseProps[],
  selectedGenreId: number,
  selectedGenre: GenreResponseProps,
  setSelectedGenreId: React.Dispatch<React.SetStateAction<number>>
}

export const MoviesContext = createContext<MoviesAndGenresData>({} as MoviesAndGenresData);

export function MoviesProvider({children}: MoviesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  return (
    <MoviesContext.Provider value={{movies, genres, selectedGenreId, selectedGenre, setSelectedGenreId}}>
      {children}
    </MoviesContext.Provider>
  )
} 

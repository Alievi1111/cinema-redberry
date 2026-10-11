import { api } from '@/lib/api';

interface NotifyMovieResponse {
  data: {
    movieId: number;
    subscribed: boolean;
  };
}

export const notifyMovieApi = async (movieSlug: string) => {
  const response = await api.post<NotifyMovieResponse>(
    `/movies/${encodeURIComponent(movieSlug)}/notify`
  );

  return response.data.data;
};

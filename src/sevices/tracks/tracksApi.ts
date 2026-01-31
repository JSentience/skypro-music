import { http } from '@/sevices/http';
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';

export const getTracks = async (): Promise<TrackType[]> => {
  const response = await http.get('/catalog/track/all/');
  return response.data.data;
};

export const getSelections = async (): Promise<SelectionType[]> => {
  const response = await http.get('/catalog/selection/all');
  return response.data.data;
};

export const getSelectionById = async (id: number): Promise<SelectionType> => {
  const response = await http.get(`/catalog/selection/${id}`);
  return response.data.data;
};

export const getFavoriteTracks = async (): Promise<TrackType[]> => {
  const response = await http.get('/catalog/track/favorite/all/');
  return response.data.data;
};

export const addTrackToFavorites = async (trackId: number): Promise<void> => {
  await http.post(`/catalog/track/${trackId}/favorite/`);
};
export const removeTrackFromFavorites = async (
  trackId: number,
): Promise<void> => {
  await http.delete(`/catalog/track/${trackId}/favorite/`);
};

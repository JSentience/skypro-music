import { http } from '@/services/http';
import { SelectionType, TrackType } from '@/sharedTypes/sharedTypes';

const getData = async <T>(url: string): Promise<T> => {
  const response = await http.get(url);
  return response.data.data as T;
};

export const getTracks = async (): Promise<TrackType[]> => {
  return getData<TrackType[]>('/catalog/track/all/');
};

export const getSelections = async (): Promise<SelectionType[]> => {
  return getData<SelectionType[]>('/catalog/selection/all');
};

export const getSelectionById = async (id: number): Promise<SelectionType> => {
  return getData<SelectionType>(`/catalog/selection/${id}`);
};

export const getFavoriteTracks = async (): Promise<TrackType[]> => {
  return getData<TrackType[]>('/catalog/track/favorite/all/');
};

export const addTrackToFavorites = async (trackId: number): Promise<void> => {
  await http.post(`/catalog/track/${trackId}/favorite/`);
};

export const removeTrackFromFavorites = async (
  trackId: number,
): Promise<void> => {
  await http.delete(`/catalog/track/${trackId}/favorite/`);
};

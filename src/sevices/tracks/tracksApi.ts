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

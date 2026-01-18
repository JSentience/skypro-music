import { SelectionType } from '@/sharedTypes/sharedTypes';
import axios from 'axios';
import { BASE_URL } from '../constants';

export const getSelections = async (): Promise<SelectionType[]> => {
  const response = await axios.get(BASE_URL + '/catalog/selection/all', {
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data.data;
};
export const getSelectionById = async (id: number): Promise<SelectionType> => {
  const response = await axios.get(BASE_URL + `/catalog/selection/${id}`, {
    headers: {
      'content-type': 'application/json',
    },
  });
  return response.data.data;
};

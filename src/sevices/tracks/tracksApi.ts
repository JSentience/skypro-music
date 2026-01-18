import { BASE_URL } from '@/sevices/constants';
import { TrackType } from '@/sharedTypes/sharedTypes';
import axios from 'axios';

axios.defaults.proxy = false;

export const getTracks = async (): Promise<TrackType[]> => {
  return axios(BASE_URL + '/catalog/track/all/').then((response) => {
    return response.data.data;
  });
};

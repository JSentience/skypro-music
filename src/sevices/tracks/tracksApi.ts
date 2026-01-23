import { BASE_URL } from '@/sevices/constants';
import { TrackType } from '@/sharedTypes/sharedTypes';
import axios from 'axios';

axios.defaults.proxy = false;

export const getTracks = async (accessToken: string): Promise<TrackType[]> => {
  return axios
    .get(BASE_URL + '/catalog/track/all/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      return response.data.data;
    });
};

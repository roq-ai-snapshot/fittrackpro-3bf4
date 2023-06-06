import axios from 'axios';
import queryString from 'query-string';
import { FitnessCenterInterface } from 'interfaces/fitness-center';
import { GetQueryInterface } from '../../interfaces';

export const getFitnessCenters = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fitness-centers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFitnessCenter = async (fitnessCenter: FitnessCenterInterface) => {
  const response = await axios.post('/api/fitness-centers', fitnessCenter);
  return response.data;
};

export const updateFitnessCenterById = async (id: string, fitnessCenter: FitnessCenterInterface) => {
  const response = await axios.put(`/api/fitness-centers/${id}`, fitnessCenter);
  return response.data;
};

export const getFitnessCenterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/fitness-centers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFitnessCenterById = async (id: string) => {
  const response = await axios.delete(`/api/fitness-centers/${id}`);
  return response.data;
};

import axios from 'axios';
import queryString from 'query-string';
import { HealthAdviceInterface } from 'interfaces/health-advice';
import { GetQueryInterface } from '../../interfaces';

export const getHealthAdvices = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/health-advices${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHealthAdvice = async (healthAdvice: HealthAdviceInterface) => {
  const response = await axios.post('/api/health-advices', healthAdvice);
  return response.data;
};

export const updateHealthAdviceById = async (id: string, healthAdvice: HealthAdviceInterface) => {
  const response = await axios.put(`/api/health-advices/${id}`, healthAdvice);
  return response.data;
};

export const getHealthAdviceById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/health-advices/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHealthAdviceById = async (id: string) => {
  const response = await axios.delete(`/api/health-advices/${id}`);
  return response.data;
};

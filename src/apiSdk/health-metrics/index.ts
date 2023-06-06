import axios from 'axios';
import queryString from 'query-string';
import { HealthMetricInterface } from 'interfaces/health-metric';
import { GetQueryInterface } from '../../interfaces';

export const getHealthMetrics = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/health-metrics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createHealthMetric = async (healthMetric: HealthMetricInterface) => {
  const response = await axios.post('/api/health-metrics', healthMetric);
  return response.data;
};

export const updateHealthMetricById = async (id: string, healthMetric: HealthMetricInterface) => {
  const response = await axios.put(`/api/health-metrics/${id}`, healthMetric);
  return response.data;
};

export const getHealthMetricById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/health-metrics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteHealthMetricById = async (id: string) => {
  const response = await axios.delete(`/api/health-metrics/${id}`);
  return response.data;
};

import axios from 'axios';
import queryString from 'query-string';
import { WorkoutPlanInterface } from 'interfaces/workout-plan';
import { GetQueryInterface } from '../../interfaces';

export const getWorkoutPlans = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/workout-plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWorkoutPlan = async (workoutPlan: WorkoutPlanInterface) => {
  const response = await axios.post('/api/workout-plans', workoutPlan);
  return response.data;
};

export const updateWorkoutPlanById = async (id: string, workoutPlan: WorkoutPlanInterface) => {
  const response = await axios.put(`/api/workout-plans/${id}`, workoutPlan);
  return response.data;
};

export const getWorkoutPlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/workout-plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWorkoutPlanById = async (id: string) => {
  const response = await axios.delete(`/api/workout-plans/${id}`);
  return response.data;
};

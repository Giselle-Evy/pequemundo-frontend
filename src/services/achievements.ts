import api from './api';
import type { Achievement, ChildAchievements } from '../types';

export async function getAllAchievements(): Promise<Achievement[]> {
  const response = await api.get<Achievement[]>('/achievements');
  return response.data;
}

export async function getChildAchievements(childId: number): Promise<ChildAchievements> {
  const response = await api.get<ChildAchievements>(`/children/${childId}/achievements`);
  return response.data;
}
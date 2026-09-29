import api from './api';
import type { ChildProgress } from '../types';

export async function getChildProgress(childId: number): Promise<ChildProgress> {
  const response = await api.get<ChildProgress>(`/children/${childId}/progress`);
  return response.data;
}
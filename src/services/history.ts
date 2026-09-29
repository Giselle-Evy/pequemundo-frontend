import api from './api';
import type { ChildHistory } from '../types';

export async function getChildHistory(childId: number): Promise<ChildHistory> {
  const response = await api.get<ChildHistory>(`/children/${childId}/history`);
  return response.data;
}
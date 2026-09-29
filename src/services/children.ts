import api from './api';
import type { Child } from '../types';

export interface CreateChildData {
  name: string;
  age: number;
  avatar: string;
}

export async function getChildren(): Promise<Child[]> {
  const response = await api.get<Child[]>('/children');
  return response.data;
}

export async function createChild(data: CreateChildData): Promise<Child> {
  const response = await api.post<{ message: string; profile: Child }>('/children', data);
  return response.data.profile;
}

export async function updateChild(id: number, data: Partial<CreateChildData>): Promise<Child> {
  const response = await api.put<{ message: string; profile: Child }>(`/children/${id}`, data);
  return response.data.profile;
}

export async function deleteChild(id: number): Promise<void> {
  await api.delete(`/children/${id}`);
}
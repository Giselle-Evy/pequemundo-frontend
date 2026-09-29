import api from './api';
import type { Subject, SubjectWithExercises } from '../types';

export async function getSubjects(): Promise<Subject[]> {
  const response = await api.get<Subject[]>('/subjects');
  return response.data;
}

export async function getSubject(id: number): Promise<Subject> {
  const response = await api.get<Subject>(`/subjects/${id}`);
  return response.data;
}

export async function getExercisesBySubject(subjectId: number): Promise<SubjectWithExercises> {
  const response = await api.get<SubjectWithExercises>(`/subjects/${subjectId}/exercises`);
  return response.data;
}
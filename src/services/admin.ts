import api from './api';
import type { Subject, Exercise, User } from '../types';

// === MATERIAS ===
export async function adminGetSubjects(): Promise<Subject[]> {
  const response = await api.get<Subject[]>('/admin/subjects');
  return response.data;
}

export interface SubjectPayload {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  order?: number;
  is_active?: boolean;
}

export async function adminCreateSubject(payload: SubjectPayload): Promise<Subject> {
  const response = await api.post<{ message: string; subject: Subject }>(
    '/admin/subjects',
    payload
  );
  return response.data.subject;
}

export async function adminUpdateSubject(
  id: number,
  payload: Partial<SubjectPayload>
): Promise<Subject> {
  const response = await api.put<{ message: string; subject: Subject }>(
    `/admin/subjects/${id}`,
    payload
  );
  return response.data.subject;
}

export async function adminDeleteSubject(id: number): Promise<void> {
  await api.delete(`/admin/subjects/${id}`);
}

// === EJERCICIOS ===
export async function adminGetExercises(subjectId?: number): Promise<Exercise[]> {
  const url = subjectId
    ? `/admin/exercises?subject_id=${subjectId}`
    : '/admin/exercises';
  const response = await api.get<Exercise[]>(url);
  return response.data;
}

export interface ExerciseOptionPayload {
  option_text: string;
  is_correct: boolean;
  order?: number;
}

export interface ExercisePayload {
  subject_id: number;
  title: string;
  question: string;
  instructions?: string;
  type?: string;
  difficulty?: string;
  points_reward?: number;
  order?: number;
  is_active?: boolean;
  options: ExerciseOptionPayload[];
}

export async function adminCreateExercise(payload: ExercisePayload): Promise<Exercise> {
  const response = await api.post<{ message: string; exercise: Exercise }>(
    '/admin/exercises',
    payload
  );
  return response.data.exercise;
}

export async function adminUpdateExercise(
  id: number,
  payload: Partial<ExercisePayload>
): Promise<Exercise> {
  const response = await api.put<{ message: string; exercise: Exercise }>(
    `/admin/exercises/${id}`,
    payload
  );
  return response.data.exercise;
}

export async function adminDeleteExercise(id: number): Promise<void> {
  await api.delete(`/admin/exercises/${id}`);
}

// === USUARIOS ===
export async function adminGetUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/admin/users');
  return response.data;
}

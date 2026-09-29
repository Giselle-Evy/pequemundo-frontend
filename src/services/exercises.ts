import api from './api';
import type { Exercise, NewAchievement } from '../types';

export async function getExercise(id: number): Promise<Exercise> {
  const response = await api.get<Exercise>(`/exercises/${id}`);
  return response.data;
}

export interface AnswerPayload {
  child_profile_id: number;
  option_id?: number;
  answer?: string;
  matches?: Array<{ left: string; right: string }>;
}

export interface AnswerResult {
  correct: boolean;
  points_earned: number;
  total_points: number;
  progress: {
    id: number;
    child_profile_id: number;
    exercise_id: number;
    completed: boolean;
    score: number;
  };
  new_achievements: NewAchievement[];
}

export async function submitAnswer(
  exerciseId: number,
  payload: AnswerPayload
): Promise<AnswerResult> {
  const response = await api.post<AnswerResult>(
    `/exercises/${exerciseId}/answer`,
    payload
  );
  return response.data;
}
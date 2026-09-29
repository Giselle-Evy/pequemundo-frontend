import api from './api';
import type { RankingEntry } from '../types';

export async function getGlobalRanking(): Promise<RankingEntry[]> {
  const response = await api.get<RankingEntry[]>('/rankings');
  return response.data;
}

export async function getFamilyRanking(): Promise<RankingEntry[]> {
  const response = await api.get<RankingEntry[]>('/rankings/family');
  return response.data;
}
import api from './api';
import type { StoreResponse, StoreItem, Child } from '../types';

export async function getStoreItems(childId: number): Promise<StoreResponse> {
  const response = await api.get<StoreResponse>(
    `/store/items?child_profile_id=${childId}`
  );
  return response.data;
}

export interface BuyResponse {
  message: string;
  total_points: number;
  item: StoreItem;
}

export async function buyItem(
  childId: number,
  storeItemId: number
): Promise<BuyResponse> {
  const response = await api.post<BuyResponse>('/store/buy', {
    child_profile_id: childId,
    store_item_id: storeItemId,
  });
  return response.data;
}

export interface EquipResponse {
  message: string;
  child: Child;
}

export async function equipItem(
  childId: number,
  storeItemId: number
): Promise<EquipResponse> {
  const response = await api.post<EquipResponse>('/store/equip', {
    child_profile_id: childId,
    store_item_id: storeItemId,
  });
  return response.data;
}

export async function unequipItem(
  childId: number,
  category: 'avatar' | 'accessory' | 'accessory2' | 'frame'
): Promise<EquipResponse> {
  const response = await api.post<EquipResponse>('/store/unequip', {
    child_profile_id: childId,
    category,
  });
  return response.data;
}


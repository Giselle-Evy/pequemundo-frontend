import api from './api';

export interface SubscriptionStatus {
  subscribed: boolean;
  on_trial: boolean;
  on_grace_period: boolean;
  ends_at: string | null;
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const { data } = await api.get<SubscriptionStatus>('/subscription/status');
  return data;
}

export async function createCheckoutSession(): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>('/subscription/checkout');
  return data;
}

export async function getPortalUrl(): Promise<string> {
  const { data } = await api.get<{ url: string }>('/subscription/portal');
  return data.url;
}
import { api } from './api';

export interface AppConfig {
  priceId: number;
  amount: number;
  currency: string;
}

export const getAppConfig = async (): Promise<AppConfig> => {
  const response = await api.get('/products/single-event-price/');
  return response.data;
};

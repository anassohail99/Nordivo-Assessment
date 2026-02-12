import api from './api';
import { AddOn } from '../types';

class AddOnService {
  async getAllAddOns(category?: string): Promise<AddOn[]> {
    const params = category ? { category } : {};
    const response = await api.get<AddOn[]>('/addons', { params });
    return response.data;
  }

  async getAddOnById(id: string): Promise<AddOn> {
    const response = await api.get<AddOn>(`/addons/${id}`);
    return response.data;
  }
}

export default new AddOnService();

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface RestaurantUser {
  id: number;
  userId: string;
  fullName: string;
  restaurantName: string;
  category: string;
  countryCode: string;
  contactNumber: string;
  email: string;
  licenseNumber: string;
  address: string;
  licenseUrl: string;
  restaurantUrl: string;
  password?: string;
  status: string;
  bankName: string;
  accountNo: string;
  expectedVolume: string;
  agreedPrice: string;
  assignedAgent: string;
  selected?: boolean;
}

export interface DashboardData {
  message: string;
  status: string;
  collectionData: {
    revenue: number;
    quantity: number;
    online: number;
    cash: number;
    oil_types: Array<{ type: string; quantity: number }>;
  };
  restaurantUsers: RestaurantUser[];
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private endpoint = 'RestaurantUsers';

  constructor(private apiService: ApiService) { }

  // Get all restaurant users with optional status filter
  getAll(status?: string): Observable<RestaurantUser[]> {
    console.log(' RestaurantService.getAll called');
    console.log(' Status:', status);
    console.log(' Endpoint:', this.endpoint);
    const params = status ? { status } : undefined;
    console.log(' Params:', params);
    return this.apiService.get<RestaurantUser[]>(this.endpoint, params);
  }

  // Get restaurant user by ID
  getById(id: number): Observable<RestaurantUser> {
    return this.apiService.get<RestaurantUser>(`${this.endpoint}/${id}`);
  }

  // Create new restaurant user
  create(restaurantUser: Partial<RestaurantUser>): Observable<any> {
    return this.apiService.post<any>(this.endpoint, restaurantUser);
  }

  // Delete restaurant user
  delete(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  // Search restaurant users
  search(query: string): Observable<RestaurantUser[]> {
    return this.apiService.get<RestaurantUser[]>(`${this.endpoint}/search`, { query });
  }

  // Get restaurant dashboard data
  getDashboard(): Observable<DashboardData> {
    return this.apiService.get<DashboardData>(`${this.endpoint}/restaurantDashboard`);
  }
}

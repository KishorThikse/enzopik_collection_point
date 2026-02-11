import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DummyDataService } from './dummy-data.service';

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
  ifscCode?: string;
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

  constructor(
    private apiService: ApiService,
    private dummyDataService: DummyDataService
  ) { }

  // Get all restaurant users with optional status filter
  getAll(status?: string): Observable<RestaurantUser[]> {
    console.log(' RestaurantService.getAll called');
    console.log(' Status:', status);
    console.log(' Endpoint:', this.endpoint);
    const params = status ? { status } : undefined;
    console.log(' Params:', params);
    return this.apiService.get<RestaurantUser[]>(this.endpoint, params).pipe(
      tap(() => console.log(`✅ Restaurant API data loaded${status ? ` for status: ${status}` : ''}`)),
      catchError(error => {
        console.warn(`⚠️ Restaurant API failed${status ? ` for status ${status}` : ''}, using dummy data:`, error);
        return of(this.dummyDataService.getDummyRestaurants(status));
      })
    );
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

  // Update restaurant user
  update(id: number, data: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, data);
  }

  // Get orders by restaurant user ID
  getOrders(restaurantUserId: number): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/oilOrders/${restaurantUserId}`);
  }
}

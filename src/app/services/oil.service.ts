import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { DummyDataService } from './dummy-data.service';
import { ApiService } from './api.service';

// --- DATA MODELS (Interfaces) ---
// Based on the "available_vendors" array in your JSON
export interface AvailableVendor {
  id: number;
  fullName: string;
}

// Based on the main JSON object you provided 
export interface OilOrder {
  order_id: number;
  type: string;
  quantity: string;
  status: string;
  user_id: number;
  proposed_unit_price: string;
  counter_unit_price: string;
  amount: string;
  vendor_id: number;
  vendor_name: string;
  vendor_status: string;
  agent_id: number;
  oil_quality: string | null;
  oil_image: string | null;
  user_name: string;
  user_contact: string;
  registered_address: string;
  restaurant_name: string;
  hub_name: string | null;
  timeline: string;
  pickup_location: string;
  payment_method: string;
  date: string;
  time: string;
  available_vendors: AvailableVendor[];
  agreed_price: string;
}

export interface RequestOilSale {
  type: string;
  quantity: number;
  userId: number;
  paymentMethod?: string;
  reason?: string;
  counterUnitPrice?: string;
  remarks?: string;
  dateRange: string;
  address: string;
}

export interface NearestOrderRequest {
  role: string;
  id: number;
  latitude: string;
  longitude: string;
  reschedule: string;
}

// --- SERVICE CLASS ---

@Injectable({
  providedIn: 'root' // Makes the service available app-wide
})
export class OilService {

  private endpoint = 'OilCollections';

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private dummyDataService: DummyDataService
  ) { }

  /**
   * Fetches all dashboard data from the /Dashboard/all endpoint.
   */
  getAllDashboardData(): Observable<OilOrder[]> {
    return this.apiService.get<OilOrder[]>('Dashboard/all').pipe(
      tap(() => console.log('✅ Oil orders API data loaded')),
      catchError(error => {
        console.warn('⚠️ Oil orders API failed, using dummy data:', error);
        return of(this.dummyDataService.getDummyOilOrders());
      })
    );
  }

  /**
   * Submits a new oil sale request to the backend.
   */
  requestOilSale(request: RequestOilSale): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/request-oil-sale`, request);
  }

  /**
   * Fetches nearest orders based on location.
   */
  getNearestOrders(request: NearestOrderRequest): Observable<any> {
    return this.apiService.post<any>(`NearestOrder/nearest`, request);
  }

  /**
   * Fetches a single oil order by ID
   */
  getOilOrderById(id: number): Observable<OilOrder> {
    return this.apiService.get<OilOrder>(`OilSale/${id}`);
  }

  /**
   * Updates an oil order by ID
   */
  updateOilOrder(id: number, updateData: FormData): Observable<any> {
    return this.apiService.put<any>(`OilSale/${id}`, updateData);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DummyDataService } from './dummy-data.service';

export interface DashboardSummary {
  message: string;
  status: string;
  totalFBO: number;
  totalAgent: number;
  totalHubs: number;
  totalOilCollected: number;
}

export interface OilTypeSummary {
  type: string;
  totalQuantityKg: number;
  totalAmount: number;
  count: number;
}

export interface OilOrder {
  orderId: number;
  type: string;
  quantity: string;
  status: string;
  userId: number;
  proposedUnitPrice: string;
  counterUnitPrice: string;
  amount: string;
  vendorId: number;
  vendorName: string;
  vendorStatus: string;
  agentId: number;
  oilQuality: string;
  oilImage: string | null;
  userName: string;
  userContact: string;
  registeredAddress: string;
  restaurantName: string;
  hubName: string;
  timeline: string;
  pickupLocation: string;
  paymentMethod: string;
  date: string;
  time: string;
  availableVendors: any[];
  agreedPrice: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private endpoint = 'Dashboard/summary-data';

  constructor(
    private apiService: ApiService,
    private dummyDataService: DummyDataService
  ) { }

  // Get dashboard summary data
  getSummaryData(): Observable<DashboardSummary> {
    return this.apiService.get<DashboardSummary>('Dashboard/homepage-summary-data').pipe(
      tap(data => console.log('✅ Dashboard summary API data loaded:', data)),
      catchError(error => {
        console.error('❌ Dashboard summary API failed:', error);
        throw error;
      })
    );
  }

  // Get oil summary by type for donut chart
  getOilSummaryByType(): Observable<OilTypeSummary[]> {
    return this.apiService.get<OilTypeSummary[]>('Dashboard/DonutChart-Oil-summary-by-type-Completed').pipe(
      tap(data => console.log('✅ Oil summary API data loaded:', data)),
      catchError(error => {
        console.error('❌ Oil summary API failed:', error);
        throw error;
      })
    );
  }

  // Get all oil orders for the dashboard table
  getAllOilOrders(status?: string): Observable<OilOrder[]> {
    const params = status ? { status } : {};
    return this.apiService.get<OilOrder[]>('Dashboard/all-oil-orders', params).pipe(
      tap(data => console.log('✅ All oil orders API data loaded:', data)),
      catchError(error => {
        console.error('❌ All oil orders API failed:', error);
        throw error;
      })
    );
  }
}

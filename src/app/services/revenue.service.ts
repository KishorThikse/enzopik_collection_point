import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DummyDataService } from './dummy-data.service';

export interface RevenueData {
  date: string;
  amount: number;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private endpoint = 'Dashboard/LineChart-Oil-Quantity-Analytics-Acknowledged';

  constructor(
    private apiService: ApiService,
    private dummyDataService: DummyDataService
  ) { }

  // Get revenue data
  getRevenue(startDate?: string, endDate?: string): Observable<RevenueData[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.apiService.get<RevenueData[]>(this.endpoint, params);
  }

  // Get revenue by period (today, monthly, yearly)
  getRevenueByPeriod(period: 'today' | 'monthly' | 'yearly'): Observable<RevenueData[]> {
    return this.apiService.get<RevenueData[]>(this.endpoint, { period }).pipe(
      tap(data => console.log(`✅ API data loaded for period: ${period}`, data)),
      catchError(error => {
        console.error(`❌ API failed for period ${period}:`, error);
        throw error;
      })
    );
  }
}

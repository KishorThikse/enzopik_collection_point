import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface RevenueData {
  date: string;
  amount: number;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  private endpoint = 'Revenue';

  constructor(private apiService: ApiService) { }

  // Get revenue data
  getRevenue(startDate?: string, endDate?: string): Observable<RevenueData[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.apiService.get<RevenueData[]>(this.endpoint, params);
  }

  // Get revenue by period (today, monthly, yearly)
  getRevenueByPeriod(period: 'today' | 'monthly' | 'yearly'): Observable<RevenueData[]> {
    return this.apiService.get<RevenueData[]>(this.endpoint, { period });
  }
}

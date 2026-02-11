import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface AdminDashboardData {
    revenue: number;
    quantity: number;
    online: number;
    cash: number;
    oil_types: Array<{ type: string; quantity: number }>;
    agent: any[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private apiService: ApiService) { }

    getDashboardData(): Observable<any> {
        return this.apiService.get<any>('Agents/agentDashboard');
    }

    getAdminList(): Observable<any[]> {
        return this.apiService.get<any[]>('Agents/Admin');
    }

    getAgentsList(): Observable<any[]> {
        return this.apiService.get<any[]>('Agents/agents-list');
    }

    getHubsList(): Observable<any[]> {
        return this.apiService.get<any[]>('Agents/hubs-list');
    }

    getPendingVendors(): Observable<any[]> {
        return this.apiService.get<any[]>('Vendors?status=pending');
    }

    getPendingRestaurants(): Observable<any[]> {
        return this.apiService.get<any[]>('RestaurantUsers?status=pending');
    }

    approveVendor(id: number, status: string, hubId?: number): Observable<any> {
        return this.apiService.put<any>(`Agents/approve/vendor/${id}/${status}${hubId ? '?hubId=' + hubId : ''}`, {});
    }

    approveRestaurant(id: number, status: string, hubId?: number): Observable<any> {
        return this.apiService.put<any>(`Agents/approve/restaurant/${id}/${status}${hubId ? '?hubId=' + hubId : ''}`, {});
    }

    addAdmin(adminData: any): Observable<any> {
        return this.apiService.post<any>('Agents/Add-Admin', adminData);
    }

    updateAdmin(id: number, adminData: any): Observable<any> {
        return this.apiService.put<any>(`Agents/Edit-Admin-Details/${id}`, adminData);
    }

    deleteAdmin(id: number): Observable<any> {
        return this.apiService.delete<any>(`Agents/Delete-Admin/${id}`);
    }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SubAgentService {
    constructor(private apiService: ApiService) { }

    getAllSubAgents(): Observable<any[]> {
        return this.apiService.get<any[]>('SubAgent');
    }

    getSubAgentById(id: string | number): Observable<any> {
        return this.apiService.get<any>(`SubAgent/${id}`);
    }

    updateSubAgent(id: string | number, data: any): Observable<any> {
        return this.apiService.put<any>(`SubAgent/${id}`, data);
    }

    getHubWiseAgents(id: string | number): Observable<any[]> {
        return this.apiService.get<any[]>(`SubAgent/hubwise-agents/${id}`);
    }

    getHubOrders(id: string | number): Observable<any[]> {
        return this.apiService.get<any[]>(`SubAgent/hub/${id}/oilorders`);
    }
}

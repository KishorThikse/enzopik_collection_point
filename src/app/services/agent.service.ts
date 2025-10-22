import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Agent {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  contactNumber: string;
  location: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private endpoint = 'Agents';

  constructor(private apiService: ApiService) { }

  // Get all agents
  getAll(): Observable<Agent[]> {
    return this.apiService.get<Agent[]>(this.endpoint);
  }

  // Get agent by ID
  getById(id: number): Observable<Agent> {
    return this.apiService.get<Agent>(`${this.endpoint}/${id}`);
  }

  // Create new agent
  create(agent: Partial<Agent>): Observable<any> {
    return this.apiService.post<any>(this.endpoint, agent);
  }

  // Update agent
  update(id: number, agent: Partial<Agent>): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, agent);
  }

  // Delete agent
  delete(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}

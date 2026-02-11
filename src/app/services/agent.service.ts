import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DummyDataService } from './dummy-data.service';

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

  constructor(
    private apiService: ApiService,
    private dummyDataService: DummyDataService
  ) { }

  // Get all agents
  getAll(): Observable<Agent[]> {
    return this.apiService.get<Agent[]>(this.endpoint).pipe(
      tap(() => console.log('✅ Agent API data loaded')),
      catchError(error => {
        console.warn('⚠️ Agent API failed, using dummy data:', error);
        return of(this.dummyDataService.getDummyAgents());
      })
    );
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

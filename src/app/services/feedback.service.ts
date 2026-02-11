import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Feedback {
    id?: number;
    role: string;
    roleId: string;
    feedback1: string;
    date: string;
}

export interface FeedbackDTO {
    role: string;
    id: number;
    feedback: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    constructor(private apiService: ApiService) { }

    addFeedback(dto: FeedbackDTO): Observable<any> {
        return this.apiService.post('Feedback/add', dto);
    }

    getAllFeedbacks(): Observable<any> {
        return this.apiService.get('Feedback/all');
    }
}

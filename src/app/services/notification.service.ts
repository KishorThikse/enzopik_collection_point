import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Notification {
    id: number;
    to: string;
    ownerId: number;
    orderId?: number;
    reason: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly endpoint = 'Notifications';

    constructor(private api: ApiService) { }

    getUnreadCount(ownerId: number, roleName: string): Observable<{ status: string, unreadCount: number }> {
        return this.api.get<{ status: string, unreadCount: number }>(`${this.endpoint}/count/${ownerId}?roleName=${roleName}`);
    }

    // Note: The backend controller is missing a GetNotifications method. 
    // I will check if I should add it to the backend or if there's another way.
    // Assuming we might need it, I'll define the frontend part.
    getNotifications(ownerId: number, roleName: string): Observable<{ status: string, notifications: Notification[] }> {
        return this.api.get<{ status: string, notifications: Notification[] }>(`${this.endpoint}/${ownerId}?roleName=${roleName}`);
    }

    markAsRead(notificationId: number): Observable<any> {
        return this.api.put(`${this.endpoint}/read/${notificationId}`, {});
    }

    markAsUnread(notificationId: number): Observable<any> {
        return this.api.put(`${this.endpoint}/unread/${notificationId}`, {});
    }
}

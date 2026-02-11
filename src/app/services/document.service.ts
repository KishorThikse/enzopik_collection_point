import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

export interface DocumentDTO {
    fileName: string;
    url: string;
    size: number;
    uploadedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private baseUrl = environment.apiUrl;

    constructor(private apiService: ApiService) { }

    getDocuments(entityId: string | number): Observable<DocumentDTO[]> {
        return this.apiService.get<DocumentDTO[]>(`Documents/${entityId}`);
    }

    uploadDocument(entityId: string | number, file: File): Observable<DocumentDTO> {
        const formData = new FormData();
        formData.append('file', file);
        return this.apiService.post<DocumentDTO>(`Documents/${entityId}/upload`, formData);
    }

    deleteDocument(entityId: string | number, fileName: string): Observable<any> {
        return this.apiService.delete(`Documents/${entityId}/files/${encodeURIComponent(fileName)}`);
    }

    downloadDocument(url: string): void {
        // Construct the absolute URL manually if it's relative
        let fullUrl = url;
        if (!url.startsWith('http')) {
            const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
            // Note: Backend seems to return URLs starting with /api/documents, 
            // but environment.apiUrl already ends with /api. 
            // If backend url starts with /api, we need to handle that.
            if (cleanUrl.startsWith('api/')) {
                // Assuming environment.apiUrl is '.../api' and cleanUrl is 'api/documents/...'
                // We might just need the part after 'api/' if we use the baseUrl
                // OR just use the domain from environment.apiUrl
                const domain = this.baseUrl.split('/api')[0];
                fullUrl = `${domain}/${cleanUrl}`;
            } else {
                fullUrl = `${this.baseUrl}/${cleanUrl}`;
            }
        }
        window.open(fullUrl, '_blank');
    }
}

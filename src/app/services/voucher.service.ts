import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface VoucherRequest {
    role: string;
    id: number;
}

export interface VoucherDownloadRequest extends VoucherRequest {
    timeline?: string;
    fromDate?: string;
    toDate?: string;
    orderId?: number;
}

@Injectable({
    providedIn: 'root'
})
export class VoucherService {
    private endpoint = 'Voucher';

    constructor(private apiService: ApiService) { }

    getAcknowledgedVouchers(request: VoucherRequest): Observable<any> {
        return this.apiService.post<any>(`${this.endpoint}/acknowledged`, request);
    }

    downloadVoucher(request: VoucherDownloadRequest): Observable<Blob> {
        // For downloads, we might need to handle it differently if we want to download the PDF
        // But since the current ApiService.post might not be set up for Blobs, 
        // we might need to handle it via a form post or a different helper if needed.
        // Assuming we want to open it or download it:
        return this.apiService.post<Blob>(`${this.endpoint}/download`, request);
    }

    // Helper to download the voucher as a PDF
    downloadVoucherPdf(request: VoucherDownloadRequest): void {
        // A common way to handle POST with file response is calling a method that creates a temporary form or uses fetch
        // But for now, let's assume we can use a direct helper or build a URL if it were a GET.
        // Since it's a POST, we'll need logic in the component to handle the response or use a specific helper.
    }
}

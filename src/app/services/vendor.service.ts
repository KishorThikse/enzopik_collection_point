import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Vendor {
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
export class VendorService {
  private endpoint = 'Vendors';

  constructor(private apiService: ApiService) { }

  // Get all vendors
  getAll(): Observable<Vendor[]> {
    return this.apiService.get<Vendor[]>(this.endpoint);
  }

  // Get vendor by ID
  getById(id: number): Observable<Vendor> {
    return this.apiService.get<Vendor>(`${this.endpoint}/${id}`);
  }

  // Create new vendor
  create(vendor: Partial<Vendor>): Observable<any> {
    return this.apiService.post<any>(this.endpoint, vendor);
  }

  // Update vendor
  update(id: number, vendor: Partial<Vendor>): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}/${id}`, vendor);
  }

  // Delete vendor
  delete(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { DummyDataService } from './dummy-data.service';

export interface Vendor {
  id?: number;
  fullName: string;
  dob: string;
  age: string | number;
  gender: string;
  countryCode: string;
  contactNumber: string;
  email: string;
  licenseNumber: string;
  pincode: string;
  address: string;
  profile: string;
  password?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private endpoint = 'Vendors';

  constructor(
    private apiService: ApiService,
    private dummyDataService: DummyDataService
  ) { }

  // Get all vendors
  getAll(status?: string): Observable<Vendor[]> {
    const params = status ? { status } : {};
    return this.apiService.get<Vendor[]>(this.endpoint, params).pipe(
      tap(() => console.log(`✅ Vendor API data loaded${status ? ` for status: ${status}` : ''}`)),
      catchError(error => {
        console.warn(`⚠️ Vendor API failed${status ? ` for status ${status}` : ''}, using dummy data:`, error);
        return of(this.dummyDataService.getDummyVendors(status));
      })
    );
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

  // Get oil orders by vendor ID
  getOrdersByVendor(vendorId: number): Observable<any[]> {
    return this.apiService.get<any[]>(`${this.endpoint}/oilOrders/${vendorId}`);
  }

  // Get rejected orders by vendor ID
  getRejectedOrders(vendorId: number): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/${vendorId}/rejected-orders`);
  }

  // Get vendor assigned details by vendor ID
  getAssignedDetails(vendorId: number): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/vendorAssignedDetails/${vendorId}`);
  }

  // Delete vendor
  delete(id: number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }
}

import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { SubAgentService } from '../services/subagent.service';
import { DocumentService, DocumentDTO } from '../services/document.service';
import { take } from 'rxjs/operators';
import { RestaurantData } from '../agent/agent';
import { Oil } from '../oil/oil';

interface HubData {
  hubName: string;
  city: string;
  area: string;
  inchargeName: string;
  inchargeAvatar: string;
  status: string;
  email: string;
  contact: string;
  address?: string;
  state?: string;
  pincode?: string;
  country?: string;
  gender?: string;
  age?: string | number;
  odooCode?: string;
  idNumber?: string;
  emailAddress?: string;
  hubIncharge?: string;
  inchargeContact?: string;
  hubNumber?: string;
  numberOfAgents?: number;
  numberOfOrders?: number;
  totalOilCollected?: string;
}

interface Order {
  restaurantName: string;
  oilType: string;
  quantity: string;
  amount: number;
  assignedTo: {
    name: string;
    avatar: string;
  };
  date: string;
  hubName: string;
  status: string;
}

@Component({
  selector: 'app-hubs',
  standalone: false,
  templateUrl: './hubs.html',
  styleUrl: './hubs.scss',
  encapsulation: ViewEncapsulation.None
})
export class Hubs implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  activeTab: 'all' | 'onboarding' = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  selectedHub: HubData | null = null;
  showDetailView: boolean = false;
  detailActiveTab: string = 'hub-incharge';
  hubOrders: Order[] = [];
  hubAgents: RestaurantData[] = [];
  hubDocuments: DocumentDTO[] = [];
  hubsData: HubData[] = [];
  isEditing: boolean = false;
  saving: boolean = false;
  validationErrors: string[] = [];

  constructor(
    private subAgentService: SubAgentService,
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadHubs();
  }

  get paginatedHubs() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.hubsData.slice(startIndex, startIndex + this.pageSize);
  }

  loadHubs(): void {
    console.log('📡 Fetching all hubs (SubAgents) from API...');
    this.subAgentService.getAllSubAgents()
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          console.log('📥 Hubs API Response received:', response);
          const rawData = response.data || response;
          const data = Array.isArray(rawData) ? rawData : (rawData.items || []);

          if (data && Array.isArray(data)) {
            this.hubsData = data.map(item => ({
              hubName: item.HubName || item.hubName || item.name || 'N/A',
              city: item.City || item.city || 'N/A',
              area: item.Area || item.area || item.Location || item.location || 'N/A',
              inchargeName: item.hub_incharge_name || item.HubInchargeName || item.hubInchargeName || item.inchargeName || 'N/A',
              inchargeAvatar: item.InchargeAvatar || item.inchargeAvatar || `https://i.pravatar.cc/150?u=${item.id || item.Id || Math.random()}`,
              status: item.Status || item.status || 'Active',
              email: item.email_address || item.EmailAddress || item.email || 'N/A',
              contact: String(item.incharge_number || item.InchargeNumber || item.Contact || item.contact || 'N/A'),
              address: item.Location || item.location || item.Address || item.address || '',
              state: item.State || item.state || '',
              pincode: item.Pincode || item.pincode || '',
              country: item.country_code || item.CountryCode || item.country || 'India',
              gender: item.Gender || item.gender || 'N/A',
              age: item.Age || item.age || 0,
              odooCode: String(item.agent_id || item.AgentId || item.OdooCode || item.odooCode || ''),
              idNumber: String(item.id || item.Id || item.idNumber || ''),
              emailAddress: item.email_address || item.EmailAddress || item.email || '',
              hubIncharge: item.hub_incharge_name || item.HubInchargeName || item.hubInchargeName || '',
              inchargeContact: String(item.incharge_number || item.InchargeNumber || ''),
              hubNumber: String(item.incharge_number || item.HubNumber || ''),
              numberOfAgents: item.NumberOfAgents || item.numberOfAgents || 0,
              numberOfOrders: item.NumberOfOrders || item.numberOfOrders || 0,
              totalOilCollected: item.TotalOilCollected || item.totalOilCollected || '0kg'
            }));
            this.totalPages = Math.ceil(this.hubsData.length / this.pageSize) || 1;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('❌ Hubs API Error:', error);
          this.cdr.detectChanges();
        }
      });
  }

  setActiveTab(tab: 'all' | 'onboarding'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }

  openHubDetail(hub: HubData): void {
    const hubId = hub.idNumber;
    if (!hubId) {
      console.error('❌ Hub ID is missing');
      return;
    }

    console.log(`📡 Fetching details for hub ID: ${hubId}`);
    this.subAgentService.getSubAgentById(hubId)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          console.log('📥 Hub Details Response:', response);
          if (response) {
            const item = response.data || response;
            // Map API response to HubData
            this.selectedHub = {
              hubName: item.HubName || item.hubName || item.name || 'N/A',
              city: item.City || item.city || 'N/A',
              area: item.Area || item.area || item.Location || item.location || 'N/A',
              inchargeName: item.hub_incharge_name || item.HubInchargeName || item.hubInchargeName || item.inchargeName || 'N/A',
              inchargeAvatar: item.InchargeAvatar || item.inchargeAvatar || hub.inchargeAvatar || `https://i.pravatar.cc/150?u=${item.id || item.Id || hubId}`,
              status: item.Status || item.status || 'Active',
              email: item.email_address || item.EmailAddress || item.email || 'N/A',
              contact: String(item.incharge_number || item.InchargeNumber || item.Contact || item.contact || 'N/A'),
              address: item.Location || item.location || item.Address || item.address || '',
              state: item.State || item.state || '',
              pincode: item.Pincode || item.pincode || '',
              country: item.country_code || item.CountryCode || item.country || 'India',
              gender: item.Gender || item.gender || 'N/A',
              age: item.Age || item.age || 0,
              odooCode: String(item.agent_id || item.AgentId || item.OdooCode || item.odooCode || ''),
              idNumber: String(item.id || item.Id || hubId),
              emailAddress: item.email_address || item.EmailAddress || item.email || '',
              hubIncharge: item.hub_incharge_name || item.HubInchargeName || item.hubInchargeName || '',
              inchargeContact: String(item.incharge_number || item.InchargeNumber || ''),
              hubNumber: String(item.incharge_number || item.HubNumber || ''),
              numberOfAgents: item.NumberOfAgents || item.numberOfAgents || 0,
              numberOfOrders: item.NumberOfOrders || item.numberOfOrders || 0,
              totalOilCollected: item.TotalOilCollected || item.totalOilCollected || '0kg'
            };
            this.showDetailView = true;
            this.loadHubOrders(this.selectedHub);
            this.loadHubDocuments(this.selectedHub);
            this.loadHubAgents(this.selectedHub);
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('❌ Error fetching hub details:', error);
          // Fallback to local data if API fails
          this.selectedHub = hub;
          this.showDetailView = true;
          this.cdr.detectChanges();
        }
      });
  }

  closeHubDetail(): void {
    this.showDetailView = false;
    this.selectedHub = null;
    this.hubOrders = [];
    this.hubDocuments = [];
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.validationErrors = [];
    this.cdr.detectChanges();
  }

  updateProfile(): void {
    if (!this.selectedHub || !this.selectedHub.idNumber) return;

    this.saving = true;
    this.validationErrors = [];
    const id = this.selectedHub.idNumber;

    // Construct the payload for the PUT request
    // Mapping internal HubData fields to API expected fields based on database schema
    const payload = {
      Id: id,
      hubName: this.selectedHub.hubName,
      city: this.selectedHub.city,
      area: this.selectedHub.area,
      Location: this.selectedHub.area, // Mapping 'area' to required 'Location'
      inchargeName: this.selectedHub.inchargeName,
      HubInchargeName: this.selectedHub.inchargeName, // Mapping 'inchargeName' to required 'HubInchargeName'
      hub_incharge_name: this.selectedHub.inchargeName, // Database snake_case fallback
      agent_id: parseInt(this.selectedHub.odooCode || '0'), // Database agent_id
      incharge_number: this.selectedHub.inchargeContact, // Database incharge_number
      email_address: this.selectedHub.emailAddress, // Database email_address
      status: this.selectedHub.status,
      address: this.selectedHub.address,
      state: this.selectedHub.state,
      pincode: this.selectedHub.pincode,
      country_code: this.selectedHub.country, // Database country_code
      gender: this.selectedHub.gender,
      age: this.selectedHub.age,
      numberOfAgents: this.selectedHub.numberOfAgents,
      numberOfOrders: this.selectedHub.numberOfOrders,
      totalOilCollected: this.selectedHub.totalOilCollected
    };

    console.log(`🚀 Updating hub profile for ID: ${id}`, payload);

    this.subAgentService.updateSubAgent(id, payload)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          console.log('✅ Profile updated successfully:', response);
          this.isEditing = false;
          this.saving = false;

          // If the server returns the updated object, use it; 
          // otherwise, our local selectedHub is already updated via ngModel.
          // We just need to make sure the changes are locked in.
          if (response && response.id) {
            // Repopulate selectedHub to ensure we have the server's version
            this.openHubDetail(this.selectedHub!);
          }

          // Refresh the list to show updated data in the table too
          this.loadHubs();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('❌ Error updating profile:', error);
          this.saving = false;

          // Handle validation errors (400 Bad Request)
          if (error.status === 400 && error.error && error.error.errors) {
            const errorObj = error.error.errors;
            this.validationErrors = Object.keys(errorObj).map(key => {
              return `${key}: ${errorObj[key].join(', ')}`;
            });
            console.log('⚠️ Formatted Validation Errors:', this.validationErrors);
          } else {
            alert('Failed to update profile. Please check the console for details.');
          }

          this.cdr.detectChanges();
        }
      });
  }

  setDetailTab(tab: string): void {
    this.detailActiveTab = tab;
    // Reload data when switching tabs
    if (tab === 'agent') {
      this.onAgentTabActivated();
    } else if (tab === 'order') {
      if (this.selectedHub) {
        this.loadHubOrders(this.selectedHub);
      }
    }
  }

  loadHubOrders(hub: HubData): void {
    const hubId = hub.idNumber;
    if (!hubId) return;

    console.log(`📡 Fetching orders for hub ID: ${hubId}`);
    this.subAgentService.getHubOrders(hubId)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          console.log('📥 Hub Orders API Response:', response);
          const data = response.data || response;

          if (data && Array.isArray(data)) {
            this.hubOrders = data.map(item => ({
              restaurantName: item.RestaurantName || item.restaurantName || item.userName || 'N/A',
              oilType: item.Type || item.type || item.oilType || 'Used Cooking Oil',
              quantity: item.Quantity || item.quantity || '0L',
              amount: item.Amount || item.amount || 0,
              assignedTo: {
                name: item.VendorName || item.vendorName || hub.inchargeName || 'N/A',
                avatar: item.VendorAvatar || item.vendorAvatar || `https://i.pravatar.cc/150?u=${item.VendorId || Math.random()}`
              },
              date: item.Date || item.date || new Date().toISOString().split('T')[0],
              hubName: item.HubName || item.hubName || hub.hubName,
              status: item.Status || item.status || 'Pending'
            }));
            this.cdr.detectChanges();
          } else {
            this.hubOrders = [];
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('❌ Error fetching hub orders:', error);
          this.hubOrders = [];
          this.cdr.detectChanges();
        }
      });
  }

  loadHubAgents(hub: HubData): void {
    const hubId = hub.idNumber;
    if (!hubId) return;

    console.log(`📡 Fetching agents for hub ID: ${hubId}`);
    this.subAgentService.getHubWiseAgents(hubId)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          console.log('📥 Hub Agents API Response:', response);
          const data = response.data || response;

          if (data && Array.isArray(data)) {
            this.hubAgents = data.map(item => {
              // Map 'approved' or other backend statuses to what the Agent component expects
              let mappedStatus = item.Status || item.status || 'Active';
              const statusLower = mappedStatus.toLowerCase();
              if (statusLower === 'approved') mappedStatus = 'Active';
              else if (statusLower === 'rejected') mappedStatus = 'Rejected';
              else if (statusLower === 'inactive') mappedStatus = 'Inactive';
              else mappedStatus = 'Active'; // Default to Active

              return {
                id: item.Id || item.id,
                owner: item.FullName || item.fullName || item.name || 'N/A',
                status: mappedStatus,
                dob: item.Dob || item.dob || '01/01/1990',
                age: parseInt(item.Age || item.age || '0'),
                gender: item.Gender || item.gender || 'N/A',
                email: item.Email || item.email || 'N/A',
                phone: item.ContactNumber || item.contactNumber || item.phone || 'N/A',
                licenseNo: item.LicenseNumber || item.licenseNumber || 'N/A',
                location: item.Address || item.address || item.location || 'N/A'
              };
            });
            console.log(`✅ Successfully mapped ${this.hubAgents.length} agents for this hub.`);
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('❌ Error fetching hub agents:', error);
          this.hubAgents = [];
          this.cdr.detectChanges();
        }
      });
  }

  loadHubDocuments(hub: HubData): void {
    const hubId = hub.idNumber;
    if (!hubId) return;

    console.log(`📡 Fetching documents for hub ID: ${hubId}`);
    this.documentService.getDocuments(hubId)
      .pipe(take(1))
      .subscribe({
        next: (docs) => {
          this.hubDocuments = docs;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error fetching documents:', err);
          this.hubDocuments = [];
          this.cdr.detectChanges();
        }
      });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.selectedHub?.idNumber) {
      this.uploadDocument(file);
    }
  }

  uploadDocument(file: File): void {
    if (!this.selectedHub?.idNumber) return;

    console.log('🚀 Uploading document:', file.name);
    this.documentService.uploadDocument(this.selectedHub.idNumber, file)
      .pipe(take(1))
      .subscribe({
        next: (newDoc) => {
          console.log('✅ Document uploaded successfully');
          this.loadHubDocuments(this.selectedHub!);
          // Reset file input
          if (this.fileInput) this.fileInput.nativeElement.value = '';
        },
        error: (err) => {
          console.error('❌ Error uploading document:', err);
          alert('Failed to upload document.');
        }
      });
  }

  triggerUpload(): void {
    this.fileInput.nativeElement.click();
  }

  deleteDocument(doc: DocumentDTO): void {
    if (!this.selectedHub?.idNumber) return;

    if (confirm(`Are you sure you want to delete ${doc.fileName}?`)) {
      this.documentService.deleteDocument(this.selectedHub.idNumber, doc.fileName)
        .pipe(take(1))
        .subscribe({
          next: () => {
            console.log('✅ Document deleted successfully');
            this.loadHubDocuments(this.selectedHub!);
          },
          error: (err) => {
            console.error('❌ Error deleting document:', err);
            alert('Failed to delete document.');
          }
        });
    }
  }

  downloadDocument(doc: DocumentDTO): void {
    console.log('Downloading:', doc.fileName);
    this.documentService.downloadDocument(doc.url);
  }

  onAgentTabActivated(): void {
    if (this.selectedHub) {
      console.log('🔄 Agent tab activated, reloading hub agents...');
      this.loadHubAgents(this.selectedHub);
    }
  }
}
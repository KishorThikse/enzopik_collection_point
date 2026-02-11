import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { VendorService, Vendor } from '../services/vendor.service';
export interface RestaurantData {
  id?: number;
  owner: string;
  status: string;
  dob: string;
  age: string | number;
  gender: string;
  email: string;
  phone: string;
  licenseNo: string;
  location?: string;
}

// Import Order interface from Home component
interface Order {
  restaurant: string;
  oilType: string;
  quantity: string;
  amount: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
  date: string;
  status: string;
  selected: boolean;
}
@Component({
  selector: 'app-agent-table',
  standalone: false,
  templateUrl: './agent-table.html',
  styleUrl: './agent-table.scss'
})
export class AgentTable {
  @Input() showOnlyTable: boolean = false;
  @Input() externalAgents: RestaurantData[] = [];

  searchText: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  activeTab: string = 'overall';

  restaurants: RestaurantData[] = [];
  filteredRestaurants: RestaurantData[] = [];

  showProfileView: boolean = false;
  selectedAgent: RestaurantData | null = null;

  // Add property for agent orders
  agentOrders: Order[] = [];

  constructor(
    private vendorService: VendorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVendorsIfNeeded();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalAgents'] && this.externalAgents.length === 0) {
      this.loadVendorsIfNeeded();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onTabActivated(): void {
    this.loadVendorsIfNeeded();
  }

  private loadVendorsIfNeeded(): void {
    if (!this.restaurants || this.restaurants.length === 0) {
      this.loadVendors();
    }
  }

  loadVendors(): void {
    // Backend requires a status parameter. Default to 'Approved' for overall tab.
    const status = this.activeTab === 'onboarding' ? 'Pending' : 'Approved';

    this.vendorService.getAll(status).subscribe({
      next: (response: any) => {
        // Handle both direct array responses and wrapped responses (data or items)
        const rawData = response.data || response;
        const vendors = Array.isArray(rawData) ? rawData : (rawData.items || []);

        if (vendors && vendors.length > 0) {
          this.restaurants = this.mapVendorsToRestaurantData(vendors);
          this.filteredRestaurants = [...this.restaurants];
          this.calculateTotalPages();
          this.currentPage = 1;
        } else {
          this.restaurants = [];
          this.filteredRestaurants = [];
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading vendors:', error);
        this.restaurants = [];
        this.filteredRestaurants = [];
        this.totalPages = 1;
        this.currentPage = 1;
        this.cdr.detectChanges();
      }
    });
  }

  private mapVendorsToRestaurantData(vendors: Vendor[]): RestaurantData[] {
    return vendors.map(vendor => {
      // Map backend status to UI status
      let mappedStatus = vendor.status || 'Active';
      const statusLower = mappedStatus.toLowerCase();
      if (statusLower === 'approved') mappedStatus = 'Active';

      return {
        id: vendor.id,
        owner: vendor.fullName,
        status: mappedStatus,
        dob: vendor.dob || '01/01/1990',
        age: vendor.age || 30,
        gender: vendor.gender || 'N/A',
        email: vendor.email,
        phone: vendor.contactNumber,
        licenseNo: vendor.licenseNumber || 'N/A',
        location: vendor.address || 'N/A'
      };
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSearch(): void {
    if (!this.searchText.trim()) {
      this.filteredRestaurants = [...this.restaurants];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredRestaurants = this.restaurants.filter(restaurant =>
        restaurant.owner.toLowerCase().includes(searchLower) ||
        restaurant.status.toLowerCase().includes(searchLower) ||
        restaurant.email.toLowerCase().includes(searchLower) ||
        restaurant.gender.toLowerCase().includes(searchLower) ||
        restaurant.phone.toLowerCase().includes(searchLower) ||
        restaurant.licenseNo.toLowerCase().includes(searchLower) ||
        restaurant.dob.toLowerCase().includes(searchLower) ||
        restaurant.age.toString().toLowerCase().includes(searchLower)
      );
    }

    this.calculateTotalPages();
    this.currentPage = 1;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getInitials(name: string): string {
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredRestaurants.length / 10);
  }

  getCurrentPageItems(): RestaurantData[] {
    const itemsPerPage = 10;
    const startIndex = (this.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return this.filteredRestaurants.slice(startIndex, endIndex);
  }

  viewAgentProfile(agent: RestaurantData): void {
    this.selectedAgent = agent;
    this.showProfileView = true;
    // Load orders for this specific agent
    this.loadAgentOrders(agent);
  }

  goBackToList(): void {
    this.showProfileView = false;
    this.selectedAgent = null;
    this.agentOrders = [];
  }

  // Add this method to load agent-specific orders
  loadAgentOrders(agent: RestaurantData): void {
    // In a real application, you would fetch orders from an API based on agent ID
    // For now, using empty array (Home component will use its default data)
    this.agentOrders = [];
  }
}

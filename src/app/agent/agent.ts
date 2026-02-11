import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { VendorService, Vendor } from '../services/vendor.service';
import { Order } from '../home/home';

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


@Component({
  selector: 'app-agent',
  standalone: false,
  templateUrl: './agent.html',
  styleUrl: './agent.scss'
})
export class Agent implements OnInit, OnDestroy, OnChanges {
  @Input() showOnlyTable: boolean = false;
  @Input() externalAgents: RestaurantData[] = [];

  searchText: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  activeTab: string = 'overall';

  // Initialize with dummy agent data for immediate display
  private dummyAgents: RestaurantData[] = [
    {
      id: 1,
      owner: 'Arjun Mehta',
      status: 'Active',
      dob: '15/05/1990',
      age: 34,
      gender: 'Male',
      email: 'arjun.mehta@example.com',
      phone: '+91 9988776655',
      licenseNo: 'VL001234',
      location: '45 MG Road, Bangalore'
    },
    {
      id: 2,
      owner: 'Kavya Nair',
      status: 'Active',
      dob: '22/08/1992',
      age: 32,
      gender: 'Female',
      email: 'kavya.nair@example.com',
      phone: '+91 9988776656',
      licenseNo: 'VL001235',
      location: '78 Brigade Road, Bangalore'
    },
    {
      id: 3,
      owner: 'Vikram Singh',
      status: 'Active',
      dob: '10/03/1988',
      age: 36,
      gender: 'Male',
      email: 'vikram.singh@example.com',
      phone: '+91 9988776657',
      licenseNo: 'VL001236',
      location: '123 Koramangala, Bangalore'
    },
    {
      id: 4,
      owner: 'Ananya Reddy',
      status: 'Inactive',
      dob: '30/11/1995',
      age: 29,
      gender: 'Female',
      email: 'ananya.reddy@example.com',
      phone: '+91 9988776658',
      licenseNo: 'VL001237',
      location: '56 Indiranagar, Bangalore'
    },
    {
      id: 5,
      owner: 'Rohan Kapoor',
      status: 'Active',
      dob: '18/07/1991',
      age: 33,
      gender: 'Male',
      email: 'rohan.kapoor@example.com',
      phone: '+91 9988776659',
      licenseNo: 'VL001238',
      location: '89 Whitefield, Bangalore'
    }
  ];

  restaurants: RestaurantData[] = [];
  filteredRestaurants: RestaurantData[] = [];

  showProfileView: boolean = false;
  selectedAgent: RestaurantData | null = null;

  // Add Agent Modal Properties
  showAddModal: boolean = false;
  submittingNewAgent: boolean = false;
  newAgent: Vendor = this.getEmptyVendor();

  // Add property for agent orders
  agentOrders: Order[] = [];

  isEditingAgent: boolean = false;
  savingAgent: boolean = false;
  validationErrors: string[] = [];

  // Profile detail tabs properties
  profileActiveTab: string = 'orders';
  rejectedOrders: any[] = [];
  assignedDetails: any = { pendingData: [], approvedData: [] };
  loadingProfileData: boolean = false;

  constructor(
    private vendorService: VendorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVendorsIfNeeded();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalAgents']) {
      if (this.externalAgents && this.externalAgents.length > 0) {
        console.log('📥 Agent component received external data:', this.externalAgents.length, 'agents');
        this.restaurants = [...this.externalAgents];
        this.filteredRestaurants = [...this.restaurants];
        this.calculateTotalPages();
        this.currentPage = 1;
        this.cdr.detectChanges();
      } else if (this.showOnlyTable && this.externalAgents && this.externalAgents.length === 0) {
        // If we are showing only the table and external list is empty, clear list
        this.restaurants = [];
        this.filteredRestaurants = [];
        this.calculateTotalPages();
        this.cdr.detectChanges();
      } else {
        this.loadVendorsIfNeeded();
      }
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
      // Load dummy data immediately for responsiveness
      this.loadDummyVendors();
      // Fetch actual data from API
      this.loadVendors();
    }
  }

  // Load dummy vendors immediately for instant display
  private loadDummyVendors(): void {
    console.log(`📊 Loading dummy agent data for status: ${this.activeTab}`);
    // For 'overall' tab, show all agents. For 'onboarding', show only 'Pending'.
    if (this.activeTab === 'onboarding') {
      const status = 'Pending';
      this.restaurants = this.dummyAgents
        .filter(agent => agent.status.toLowerCase() === status.toLowerCase());
    } else {
      // Overall tab shows all
      this.restaurants = [...this.dummyAgents];
    }

    this.filteredRestaurants = [...this.restaurants];
    this.calculateTotalPages();
    this.currentPage = 1;
    console.log('✅ Dummy agents loaded');
  }

  loadVendors(): void {
    // Backend requires a status parameter. Default to 'Approved' for overall tab.
    const status = this.activeTab === 'onboarding' ? 'Pending' : 'Approved';
    console.log(`🔍 Fetching vendors from API with status: ${status}`);

    this.vendorService.getAll(status).subscribe({
      next: (response: any) => {
        console.log('📥 Agents API Response:', response);
        // Handle both direct array responses and wrapped responses (data or items)
        const rawData = response.data || response;
        const vendors = Array.isArray(rawData) ? rawData : (rawData.items || []);

        if (vendors && vendors.length > 0) {
          this.restaurants = this.mapVendorsToRestaurantData(vendors);
          this.filteredRestaurants = [...this.restaurants];
          this.calculateTotalPages();
          this.currentPage = 1;
          console.log(`✅ ${vendors.length} agents loaded successfully`);
        } else if (this.activeTab !== 'overall') {
          // If no data for specific status, maybe try overall or stay empty
          this.restaurants = [];
          this.filteredRestaurants = [];
        }
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Error loading vendors:', error);
        // Keep existing (dummy) data on error if any, or clear if needed
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

  // --- Add Agent Modal Methods ---

  private getEmptyVendor(): Vendor {
    return {
      fullName: '',
      dob: '',
      age: '',
      gender: '',
      countryCode: '91',
      contactNumber: '',
      email: '',
      licenseNumber: '',
      pincode: '',
      address: '',
      profile: 'https://i.pravatar.cc/150?u=' + Math.random(),
      password: 'Pass@' + Math.floor(Math.random() * 10000), // Default password for new agents
      status: 'Approved'
    };
  }

  openAddModal(): void {
    this.newAgent = this.getEmptyVendor();
    this.showAddModal = true;
    this.validationErrors = [];
    console.log('📬 Opening Add Agent Modal');
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.validationErrors = [];
  }

  submitNewAgent(): void {
    this.submittingNewAgent = true;
    this.validationErrors = [];

    // Ensure numeric age is sent as string if required by backend, 
    // and status is capitalized
    const payload = {
      ...this.newAgent,
      age: String(this.newAgent.age),
      status: 'Approved',
      hubId: 1 // Default hub assignment
    };

    console.log('🚀 Submitting new agent to API:', payload);

    this.vendorService.create(payload).subscribe({
      next: (response) => {
        console.log('✅ Agent created successfully:', response);
        this.submittingNewAgent = false;
        this.showAddModal = false;
        // Refresh the list to show the new agent
        this.loadVendors();
      },
      error: (error) => {
        console.error('❌ Error creating agent:', error);
        this.submittingNewAgent = false;

        if (error.status === 400 && error.error && error.error.errors) {
          const errorObj = error.error.errors;
          this.validationErrors = Object.keys(errorObj).map(key => `${key}: ${errorObj[key].join(', ')}`);
        } else {
          alert('Failed to create agent. Please check validation errors or console.');
        }
        this.cdr.detectChanges();
      }
    });
  }

  setActiveTab(tab: string): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadVendors();
    }
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
    this.profileActiveTab = 'orders'; // Default tab
    // Load orders for this specific agent
    this.loadAgentOrders(agent);
  }

  setProfileTab(tab: string): void {
    this.profileActiveTab = tab;
    if (this.selectedAgent) {
      if (tab === 'orders') {
        this.loadAgentOrders(this.selectedAgent);
      } else if (tab === 'rejected') {
        this.loadRejectedOrders(this.selectedAgent.id!);
      } else if (tab === 'assigned') {
        this.loadAssignedDetails(this.selectedAgent.id!);
      }
    }
  }

  loadRejectedOrders(id: number): void {
    this.loadingProfileData = true;
    this.vendorService.getRejectedOrders(id).subscribe({
      next: (response: any) => {
        this.rejectedOrders = response.rejectedData || [];
        this.loadingProfileData = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading rejected orders:', error);
        this.loadingProfileData = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAssignedDetails(id: number): void {
    this.loadingProfileData = true;
    this.vendorService.getAssignedDetails(id).subscribe({
      next: (response: any) => {
        this.assignedDetails = {
          pendingData: response.pendingData || [],
          approvedData: response.approvedData || []
        };
        this.loadingProfileData = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading assigned details:', error);
        this.loadingProfileData = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBackToList(): void {
    this.showProfileView = false;
    this.selectedAgent = null;
    this.agentOrders = [];
    this.rejectedOrders = [];
    this.assignedDetails = { pendingData: [], approvedData: [] };
    this.isEditingAgent = false;
  }

  toggleEditAgent(): void {
    this.isEditingAgent = !this.isEditingAgent;
    this.validationErrors = [];
  }

  saveAgentProfile(): void {
    if (!this.selectedAgent || !this.selectedAgent.id) {
      alert('Cannot save: Agent ID is missing.');
      return;
    }

    this.savingAgent = true;
    this.validationErrors = [];

    // Map RestaurantData back to exact API structure
    const payload = {
      id: this.selectedAgent.id,
      fullName: this.selectedAgent.owner,
      dob: this.selectedAgent.dob,
      age: String(this.selectedAgent.age || ''),
      gender: this.selectedAgent.gender,
      email: this.selectedAgent.email,
      contactNumber: this.selectedAgent.phone,
      licenseNumber: this.selectedAgent.licenseNo,
      address: this.selectedAgent.location,
      // Ensure other required fields are present with their existing values if possible, 
      // or sensible defaults for the update
      countryCode: 'IN',
      pincode: '600001',
      status: (this.selectedAgent.status || 'Approved').charAt(0).toUpperCase() + (this.selectedAgent.status || 'Approved').slice(1).toLowerCase(),
      hubId: 1 // Default or dynamically linked if available
    };

    console.log(`🚀 Updating agent profile for ID: ${this.selectedAgent.id}`, payload);

    this.vendorService.update(this.selectedAgent.id, payload).subscribe({
      next: (response) => {
        console.log('✅ Agent profile updated successfully:', response);
        this.savingAgent = false;
        this.isEditingAgent = false;
        // Reload vendors to reflect changes in the main list
        this.loadVendors();
      },
      error: (error) => {
        console.error('❌ Error updating agent profile:', error);
        this.savingAgent = false;

        if (error.status === 400 && error.error && error.error.errors) {
          const errorObj = error.error.errors;
          this.validationErrors = Object.keys(errorObj).map(key => `${key}: ${errorObj[key].join(', ')}`);
        } else {
          alert('Failed to update agent profile. Please check the console for details.');
        }
      }
    });
  }

  // Add this method to load agent-specific orders
  loadAgentOrders(agent: RestaurantData): void {
    if (!agent.id) return;

    this.loadingProfileData = true;
    this.vendorService.getOrdersByVendor(agent.id).subscribe({
      next: (apiOrders: any[]) => {
        this.agentOrders = apiOrders.map(order => this.transformApiOrder(order));
        this.loadingProfileData = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading agent orders:', error);
        this.agentOrders = [];
        this.loadingProfileData = false;
        this.cdr.detectChanges();
      }
    });
  }

  private transformApiOrder(apiOrder: any): Order {
    return {
      restaurant: apiOrder.restaurantName || 'N/A',
      oilType: apiOrder.type || 'N/A',
      quantity: `${apiOrder.quantity} KG`,
      amount: apiOrder.amount?.toString() || '0',
      assignedTo: {
        name: apiOrder.vendorName || 'N/A',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiOrder.vendorName || '?')}&background=random&color=fff`
      },
      date: apiOrder.date || 'N/A',
      status: apiOrder.status || 'Pending',
      selected: false
    };
  }
}
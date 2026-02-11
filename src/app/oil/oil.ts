import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
// Import the service and data models from oil.service.ts
import { OilService, OilOrder, RequestOilSale } from '../services/oil.service';
import { AuthService } from '../services/auth.service';

// This is the component's internal data model
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
  selector: 'app-oil',
  standalone: false, // Make sure you import FormsModule in your module for [(ngModel)]
  templateUrl: './oil.html',
  styleUrl: './oil.scss'
})
export class Oil implements OnInit, OnChanges, AfterViewInit {
  @Input() showOnlyTable: boolean = false;
  @Input() externalOrders: Order[] = [];

  searchText: string = '';
  orders: Order[] = [];         // Holds the master list of orders
  filteredOrders: Order[] = []; // Holds the displayed list after searching
  private dataInitialized: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // State properties for dynamic data - initialize to show data immediately
  isLoading: boolean = false;
  error: string | null = null;

  // Request Modal State
  showRequestModal: boolean = false;
  isSubmitting: boolean = false;
  requestSuccess: string | null = null;
  requestError: string | null = null;

  // Request Form Data
  newRequest: RequestOilSale = {
    type: '',
    quantity: 0,
    userId: 0,
    paymentMethod: 'Cash',
    reason: '',
    remarks: '',
    dateRange: '',
    address: ''
  };

  // Initialize with dummy oil orders for immediate display
  private dummyOrders: Order[] = [
    {
      restaurantName: 'Spice Garden',
      oilType: 'Used Cooking Oil',
      quantity: '50 KG',
      amount: 1750,
      assignedTo: {
        name: 'Arjun Mehta',
        avatar: 'https://i.pravatar.cc/150?img=11'
      },
      date: '15/01/2024',
      hubName: 'Central Hub',
      status: 'Assigned'
    },
    // ... existing dummy orders ...
  ];

  // 1. Inject the services
  constructor(
    private oilService: OilService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('🔵 Oil component ngOnInit called');
    this.initializeData();

    // Set userId from auth service
    const user = this.authService.currentUser$;
    user.subscribe(u => {
      if (u && u.id) {
        this.newRequest.userId = u.id;
      }
    });
  }

  // ... (ngAfterViewInit, ngOnChanges, initializeData, etc. remain largely the same)

  ngAfterViewInit(): void {
    console.log('🔵 Oil component ngAfterViewInit called');
    if (this.orders.length === 0 && !this.showOnlyTable) {
      this.initializeData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.showOnlyTable && changes['externalOrders']) {
      this.orders = this.externalOrders || [];
      this.applyFilter();
    }
  }

  private initializeData(): void {
    if (this.dataInitialized) return;
    this.dataInitialized = true;

    if (this.showOnlyTable) {
      this.orders = this.externalOrders || [];
      this.applyFilter();
    } else {
      this.loadDummyData();
      this.loadDashboardData();
    }
  }

  private loadDummyData(): void {
    this.orders = [
      {
        restaurantName: 'Spice Garden',
        oilType: 'Used Cooking Oil',
        quantity: '50 KG',
        amount: 1750,
        assignedTo: { name: 'Arjun Mehta', avatar: 'https://i.pravatar.cc/150?img=11' },
        date: '15/01/2024',
        hubName: 'Central Hub',
        status: 'Assigned'
      },
      {
        restaurantName: 'Green Leaf Cafe',
        oilType: 'Sunflower Oil',
        quantity: '30 KG',
        amount: 960,
        assignedTo: { name: 'Kavya Nair', avatar: 'https://i.pravatar.cc/150?img=12' },
        date: '16/01/2024',
        hubName: 'South Hub',
        status: 'Pending'
      },
      {
        restaurantName: 'Biryani House',
        oilType: 'Palm Oil',
        quantity: '75 KG',
        amount: 2850,
        assignedTo: { name: 'Vikram Singh', avatar: 'https://i.pravatar.cc/150?img=13' },
        date: '17/01/2024',
        hubName: 'Central Hub',
        status: 'Accepted'
      }
    ];
    this.applyFilter();
  }

  // ... (other helper methods)

  loadDashboardData(): void {
    this.oilService.getAllDashboardData().subscribe({
      next: (apiData) => {
        this.orders = apiData.map(order => this.transformApiOrder(order));
        this.applyFilter();
      },
      error: (err) => console.error('Error loading dashboard data', err)
    });
  }

  private transformApiOrder(apiOrder: any): Order {
    return {
      restaurantName: apiOrder.restaurant_name || apiOrder.restaurantName || 'N/A',
      oilType: apiOrder.type,
      quantity: `${apiOrder.quantity} KG`,
      amount: parseFloat(apiOrder.amount || '0'),
      assignedTo: {
        name: apiOrder.vendor_name || apiOrder.vendorName || 'N/A',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiOrder.vendor_name || '?')}`
      },
      date: apiOrder.date || 'N/A',
      hubName: apiOrder.hub_name || apiOrder.hubName || 'N/A',
      status: apiOrder.status || 'Pending'
    };
  }

  // Request Modal Management
  openRequestModal(): void {
    this.showRequestModal = true;
    this.requestSuccess = null;
    this.requestError = null;

    // Reset form but keep userId
    const currentUserId = this.newRequest.userId;
    this.newRequest = {
      type: '',
      quantity: 0,
      userId: currentUserId,
      paymentMethod: 'Cash',
      reason: '',
      remarks: '',
      dateRange: '',
      address: ''
    };
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
  }

  submitOilRequest(): void {
    if (!this.newRequest.type || !this.newRequest.quantity || !this.newRequest.address || !this.newRequest.dateRange) {
      this.requestError = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.requestError = null;

    this.oilService.requestOilSale(this.newRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.requestSuccess = 'Oil sale request submitted successfully!';
        setTimeout(() => {
          this.closeRequestModal();
          this.loadDashboardData(); // Refresh list
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.requestError = err.error?.message || 'Failed to submit request. Please try again.';
        console.error('Oil request error:', err);
      }
    });
  }

  // Filter and Pagination logic
  applyFilter(): void {
    if (!this.searchText) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order =>
        order.restaurantName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage) || 1;
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  previousPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Assigned': 'status-assigned',
      'Pending': 'status-pending',
      'Accepted': 'status-accepted',
      'Completed': 'status-completed'
    };
    return statusMap[status] || 'status-pending';
  }
}

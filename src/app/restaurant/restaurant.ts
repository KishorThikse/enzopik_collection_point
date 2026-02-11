import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestaurantService, RestaurantUser } from '../services/restaurant.service';
import { OilOrder } from '../services/oil.service';
import { Oil } from '../oil/oil';
import { DocumentService, DocumentDTO } from '../services/document.service';
import { VoucherService, VoucherRequest, VoucherDownloadRequest } from '../services/voucher.service';
import { take } from 'rxjs/operators';



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

interface Voucher {
  id: number;
  userName: string;
  type: string;
  quantity: string;
  status: string;
  userContact: string;
  address: string;
  pickupDate: string;
  amount: number;
  time: string;
}

@Component({
  selector: 'app-restaurant',
  standalone: false,
  templateUrl: './restaurant.html',
  styleUrls: ['./restaurant.scss']
})
export class Restaurant implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  hubDocuments: DocumentDTO[] = [];
  restaurantOrders: Order[] = [];
  vouchers: Voucher[] = [];

  // Pagination and status properties
  searchText: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  allChecked: boolean = false;
  loading: boolean = false;
  error: string = '';

  // Add Restaurant Properties
  showAddModal: boolean = false;
  isAdding: boolean = false;
  newRestaurant: any = {
    fullName: '',
    restaurantName: '',
    category: 'non_veg',
    countryCode: '91',
    contactNumber: '',
    email: '',
    licenseNumber: '',
    address: '',
    licenseUrl: '',
    restaurantUrl: '',
    password: '',
    status: 'pending',
    bankName: '',
    accountNo: '',
    ifscCode: '',
    expectedVolume: '',
    agreedPrice: ''
  };

  // Edit Profile Properties
  showEditModal: boolean = false;
  isSaving: boolean = false;
  editingRestaurant: any = {};

  // Initialize with dummy restaurant data for immediate display
  private dummyRestaurants: RestaurantUser[] = [
    {
      id: 1,
      userId: 'RU001',
      fullName: 'Rajesh Kumar',
      restaurantName: 'Spice Garden',
      category: 'non_veg',
      countryCode: '91',
      contactNumber: '9876543210',
      email: 'rajesh@spicegarden.com',
      licenseNumber: 'FSSAI12345',
      address: '123 MG Road, Bangalore-560001',
      licenseUrl: 'https://example.com/license1.jpg',
      restaurantUrl: 'https://spicegarden.com',
      status: 'approved',
      bankName: 'HDFC Bank',
      accountNo: 'HDFC123456',
      expectedVolume: '50kg',
      agreedPrice: '35',
      assignedAgent: 'Agent A',
      selected: false
    },
    {
      id: 2,
      userId: 'RU002',
      fullName: 'Priya Sharma',
      restaurantName: 'Green Leaf Cafe',
      category: 'veg',
      countryCode: '91',
      contactNumber: '9876543211',
      email: 'priya@greenleaf.com',
      licenseNumber: 'FSSAI12346',
      address: '456 Brigade Road, Bangalore-560025',
      licenseUrl: 'https://example.com/license2.jpg',
      restaurantUrl: 'https://greenleaf.com',
      status: 'pending',
      bankName: 'ICICI Bank',
      accountNo: 'ICICI789012',
      expectedVolume: '30kg',
      agreedPrice: '32',
      assignedAgent: 'Agent B',
      selected: false
    },
    {
      id: 3,
      userId: 'RU003',
      fullName: 'Mohammed Ali',
      restaurantName: 'Biryani House',
      category: 'non_veg',
      countryCode: '91',
      contactNumber: '9876543212',
      email: 'ali@biryanihouse.com',
      licenseNumber: 'FSSAI12347',
      address: '789 Commercial Street, Bangalore-560001',
      licenseUrl: 'https://example.com/license3.jpg',
      restaurantUrl: 'https://biryanihouse.com',
      status: 'approved',
      bankName: 'SBI',
      accountNo: 'SBI345678',
      expectedVolume: '75kg',
      agreedPrice: '38',
      assignedAgent: 'Agent C',
      selected: false
    },
    {
      id: 4,
      userId: 'RU004',
      fullName: 'Lakshmi Iyer',
      restaurantName: 'South Indian Delights',
      category: 'veg',
      countryCode: '91',
      contactNumber: '9876543213',
      email: 'lakshmi@southindian.com',
      licenseNumber: 'FSSAI12348',
      address: '321 Indiranagar, Bangalore-560038',
      licenseUrl: 'https://example.com/license4.jpg',
      restaurantUrl: 'https://southindian.com',
      status: 'rejected',
      bankName: 'Axis Bank',
      accountNo: 'AXIS901234',
      expectedVolume: '40kg',
      agreedPrice: '30',
      assignedAgent: 'Agent D',
      selected: false
    },
    {
      id: 5,
      userId: 'RU005',
      fullName: 'Amit Patel',
      restaurantName: 'Tandoor Express',
      category: 'non_veg',
      countryCode: '91',
      contactNumber: '9876543214',
      email: 'amit@tandoor.com',
      licenseNumber: 'FSSAI12349',
      address: '654 Koramangala, Bangalore-560034',
      licenseUrl: 'https://example.com/license5.jpg',
      restaurantUrl: 'https://tandoor.com',
      status: 'pending',
      bankName: 'HDFC Bank',
      accountNo: 'HDFC567890',
      expectedVolume: '60kg',
      agreedPrice: '36',
      assignedAgent: 'Agent E',
      selected: false
    },
    {
      id: 6,
      userId: 'RU006',
      fullName: 'Sneha Reddy',
      restaurantName: 'Coastal Kitchen',
      category: 'non_veg',
      countryCode: '91',
      contactNumber: '9876543215',
      email: 'sneha@coastal.com',
      licenseNumber: 'FSSAI12350',
      address: '987 Whitefield, Bangalore-560066',
      licenseUrl: 'https://example.com/license6.jpg',
      restaurantUrl: 'https://coastal.com',
      status: 'approved',
      bankName: 'ICICI Bank',
      accountNo: 'ICICI234567',
      expectedVolume: '55kg',
      agreedPrice: '37',
      assignedAgent: 'Agent F',
      selected: false
    }
  ];

  // Grouped restaurants by status
  restaurants: {
    pending: RestaurantUser[];
    approved: RestaurantUser[];
    rejected: RestaurantUser[];
  } = {
      pending: [],
      approved: [],
      rejected: []
    };



  // For combined search/filter
  filteredRestaurants: RestaurantUser[] = [];

  // Detail View Properties
  showDetailView: boolean = false;
  selectedRestaurant: RestaurantUser | null = null;
  activeTab: 'restaurant' | 'order' | 'documents' | 'voucher' = 'restaurant';

  constructor(
    private restaurantService: RestaurantService,
    private documentService: DocumentService,
    private voucherService: VoucherService,
    private cdr: ChangeDetectorRef
  ) { }

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

  ngOnInit(): void {
    console.log('🔵 Restaurant component initialized');
    // Load dummy data immediately for instant display
    this.loadDummyRestaurants();
    // Try to load API data in background
    this.loadRestaurants();
  }

  // Load dummy restaurants immediately for instant display
  private loadDummyRestaurants(): void {
    console.log('📊 Loading dummy restaurant data');

    // Group dummy restaurants by status
    this.restaurants = {
      pending: this.dummyRestaurants.filter(r => r.status === 'pending'),
      approved: this.dummyRestaurants.filter(r => r.status === 'approved'),
      rejected: this.dummyRestaurants.filter(r => r.status === 'rejected')
    };

    // Set filtered restaurants to show all
    this.filteredRestaurants = [...this.dummyRestaurants];
    this.loading = false;

    console.log('✅ Dummy restaurants loaded:', this.restaurants);
  }

  // ✅ Load all statuses together from API
  loadRestaurants(): void {
    console.log('🔵 loadRestaurants called for all statuses');
    this.loading = true;
    this.error = '';

    const statuses = ['pending', 'approved', 'rejected'];
    const requests = statuses.map(status => this.restaurantService.getAll(status));

    forkJoin(requests).subscribe({
      next: ([pending, approved, rejected]) => {
        this.restaurants = { pending, approved, rejected };
        this.filteredRestaurants = [...pending, ...approved, ...rejected];
        this.loading = false;
        console.log('✅ All restaurants loaded from API:', this.restaurants);
      },
      error: (error) => {
        console.error('❌ Error loading restaurants:', error);
        // Keep dummy data on error, don't show error message
        console.log('⚠️ Using dummy data due to API error');
        this.loading = false;
      }
    });
  }

  // ✅ Search restaurants
  onSearch(): void {
    if (!this.searchText.trim()) {
      this.filteredRestaurants = [
        ...this.restaurants.pending,
        ...this.restaurants.approved,
        ...this.restaurants.rejected
      ];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredRestaurants = [
      ...this.restaurants.pending,
      ...this.restaurants.approved,
      ...this.restaurants.rejected
    ].filter(restaurant =>
      restaurant.restaurantName.toLowerCase().includes(searchLower) ||
      restaurant.fullName.toLowerCase().includes(searchLower) ||
      restaurant.category.toLowerCase().includes(searchLower) ||
      restaurant.status.toLowerCase().includes(searchLower) ||
      restaurant.email.toLowerCase().includes(searchLower)
    );
  }

  formatPhone(countryCode: string, phone: string): string {
    return `+${countryCode} ${phone}`;
  }

  capitalizeStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      case 'on trade':
        return 'status-on-trade';
      case 'on hold':
        return 'status-on-hold';
      default:
        return '';
    }
  }

  // ✅ Format category display
  formatCategory(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  }

  // ✅ View restaurant detail
  viewRestaurant(restaurant: RestaurantUser): void {
    console.log('🔵 Viewing restaurant:', restaurant);
    this.selectedRestaurant = restaurant;
    this.showDetailView = true;
    this.activeTab = 'restaurant';
    this.loadRestaurantOrders(restaurant);
    this.loadRestaurantDocuments(restaurant);
    this.loadRestaurantVouchers(restaurant);
    window.scrollTo(0, 0);
  }

  // ✅ Load orders for selected restaurant
  loadRestaurantOrders(restaurant: RestaurantUser): void {
    console.log('🔵 Loading orders for restaurant:', restaurant.restaurantName);
    this.restaurantService.getOrders(restaurant.id)
      .pipe(take(1))
      .subscribe({
        next: (orders: any[]) => {
          this.restaurantOrders = orders.map(o => ({
            restaurantName: restaurant.restaurantName,
            oilType: o.type || 'N/A',
            quantity: `${o.quantity || 0} KG`,
            amount: parseFloat(o.amount) || 0,
            assignedTo: {
              name: o.vendorName || 'Unassigned',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(o.vendorName || '?')}&background=random&color=fff`
            },
            date: o.date || 'N/A',
            hubName: o.hubName || 'N/A',
            status: o.status || 'Pending'
          }));
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error loading restaurant orders:', err);
          this.restaurantOrders = [];
          this.cdr.detectChanges();
        }
      });
  }

  loadRestaurantDocuments(restaurant: RestaurantUser): void {
    console.log('🔵 Loading documents for restaurant:', restaurant.id);
    this.documentService.getDocuments(restaurant.id)
      .pipe(take(1))
      .subscribe({
        next: (docs) => {
          this.hubDocuments = docs;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error loading restaurant documents:', err);
          this.hubDocuments = [];
          this.cdr.detectChanges();
        }
      });
  }

  loadRestaurantVouchers(restaurant: RestaurantUser): void {
    console.log('🔵 Loading vouchers for restaurant:', restaurant.id);
    this.voucherService.getAcknowledgedVouchers({ role: 'restaurant', id: restaurant.id })
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.vouchers = res.data.map((v: any) => ({
              id: v.orderId,
              userName: v.userName,
              type: v.type,
              quantity: v.quantity,
              status: v.status,
              userContact: v.userContact,
              address: v.address,
              pickupDate: v.pickupDate ? new Date(v.pickupDate).toLocaleDateString() : 'N/A',
              amount: v.amount,
              time: v.time
            }));
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error loading vouchers:', err);
          this.vouchers = [];
          this.cdr.detectChanges();
        }
      });
  }

  downloadVoucher(voucher: Voucher): void {
    const request: VoucherDownloadRequest = {
      role: 'restaurant',
      id: this.selectedRestaurant!.id,
      orderId: voucher.id
    };
    // For now assuming a PDF endpoint that can be opened
    alert('Voucher download requested for order: ' + voucher.id);
  }

  // Document actions
  triggerUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.selectedRestaurant) {
      this.documentService.uploadDocument(this.selectedRestaurant.id, file)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loadRestaurantDocuments(this.selectedRestaurant!);
            this.fileInput.nativeElement.value = '';
          },
          error: (err) => alert('Failed to upload document')
        });
    }
  }

  deleteDocument(doc: DocumentDTO): void {
    if (confirm(`Delete ${doc.fileName}?`)) {
      this.documentService.deleteDocument(this.selectedRestaurant!.id, doc.fileName)
        .pipe(take(1))
        .subscribe({
          next: () => this.loadRestaurantDocuments(this.selectedRestaurant!),
          error: (err) => alert('Failed to delete document')
        });
    }
  }

  downloadDocument(doc: DocumentDTO): void {
    this.documentService.downloadDocument(doc.url);
  }

  // Profile Edit Logic
  openEditModal(): void {
    if (!this.selectedRestaurant) return;
    this.editingRestaurant = { ...this.selectedRestaurant };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  // Add Restaurant Logic
  openAddModal(): void {
    this.newRestaurant = {
      fullName: '',
      restaurantName: '',
      category: 'non_veg',
      countryCode: '91',
      contactNumber: '',
      email: '',
      licenseNumber: '',
      address: 'N/A',
      licenseUrl: 'N/A',
      restaurantUrl: '',
      password: '',
      status: 'pending',
      bankName: 'N/A',
      accountNo: 'N/A',
      ifscCode: 'N/A',
      expectedVolume: 'N/A',
      agreedPrice: '0'
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addRestaurant(): void {
    console.log('🔵 Adding restaurant:', this.newRestaurant);
    this.isAdding = true;

    // Basic validation
    if (!this.newRestaurant.email || !this.newRestaurant.restaurantName || !this.newRestaurant.password) {
      alert('Email, Restaurant Name and Password are required');
      this.isAdding = false;
      return;
    }

    this.restaurantService.create(this.newRestaurant)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('✅ Restaurant added successfully:', res);
          if (res.status === 'success') {
            alert('Restaurant added successfully');
            this.showAddModal = false;
            this.loadRestaurants(); // Reload the list
          } else {
            alert(res.message || 'Failed to add restaurant');
          }
          this.isAdding = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Error adding restaurant:', err);
          this.isAdding = false;
          alert('Failed to add restaurant. Please check the console for details.');
          this.cdr.detectChanges();
        }
      });
  }

  saveProfile(): void {
    if (!this.selectedRestaurant) return;
    this.isSaving = true;
    this.restaurantService.update(this.selectedRestaurant!.id, this.editingRestaurant)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            const updated = { ...this.selectedRestaurant!, ...this.editingRestaurant } as RestaurantUser;
            this.selectedRestaurant = updated;
            // Update in the main list
            const index = this.filteredRestaurants.findIndex(r => r.id === updated.id);
            if (index !== -1) {
              this.filteredRestaurants[index] = updated;
            }
            this.showEditModal = false;
            alert('Profile updated successfully');
          }
          this.isSaving = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error saving profile:', err);
          this.isSaving = false;
          alert('Failed to update profile');
          this.cdr.detectChanges();
        }
      });
  }

  // ✅ Close detail view and go back to list
  closeDetailView(): void {
    console.log('🔵 Closing detail view');
    this.showDetailView = false;
    this.selectedRestaurant = null;
    this.activeTab = 'restaurant';
    this.restaurantOrders = [];
    this.hubDocuments = [];
    this.vouchers = [];
  }

  // ✅ Select all checkboxes
  toggleAllCheckboxes(event: any): void {
    const checked = event.target.checked;
    this.allChecked = checked;
    this.filteredRestaurants.forEach(restaurant => {
      restaurant.selected = checked;
    });
  }

  // ✅ Check if all are selected
  onCheckboxChange(): void {
    this.allChecked = this.filteredRestaurants.every(restaurant => restaurant.selected);
  }
}
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RestaurantService, RestaurantUser } from '../services/restaurant.service';

interface Document {
  id: string;
  documentName: string;
}

// Add Order interface
interface Order {
  repName: string;
  oilType: string;
  country: string;
  amount: number;
  orderedBy: {
    name: string;
    avatar: string;
  };
  date: string;
  unitName: string;
  status: string;
}

@Component({
  selector: 'app-restaurant',
  standalone: false,
  templateUrl: './restaurant.html',
  styleUrls: ['./restaurant.scss']
})
export class Restaurant implements OnInit {

  hubDocuments: Document[] = [
    {
      id: '1',
      documentName: 'CV_Resume_Final.pdf',
    }
  ];

  // List View Properties
  searchText: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  allChecked: boolean = false;
  loading: boolean = false;
  error: string = '';

  // Add restaurant orders property
  restaurantOrders: Order[] = [];

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

  deleteDocument(index: number): void {
    this.hubDocuments.splice(index, 1);
    console.log(`Document at index ${index} deleted.`);
  }

  downloadDocument(doc: Document): void {
    console.log('Downloading:', doc.documentName);
    alert(`Starting download for ${doc.documentName}`);
  }

  // For combined search/filter
  filteredRestaurants: RestaurantUser[] = [];

  // Detail View Properties
  showDetailView: boolean = false;
  selectedRestaurant: RestaurantUser | null = null;
  activeTab: 'restaurant' | 'order' | 'documents' | 'voucher' = 'restaurant';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    console.log('🔵 Restaurant component initialized');
    this.loadRestaurants();
  }

  // ✅ Load all statuses together
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
        console.log('✅ All restaurants loaded:', this.restaurants);
      },
      error: (error) => {
        console.error('❌ Error loading restaurants:', error);
        this.error = 'Failed to load restaurants. Please try again.';
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
    this.loadRestaurantOrders(restaurant); // Load orders for this restaurant
    window.scrollTo(0, 0);
  }

  // ✅ Load orders for selected restaurant
  loadRestaurantOrders(restaurant: RestaurantUser): void {
    // In a real application, you would fetch orders from an API based on the restaurant
    // For now, we'll use an empty array (Oil component will use its default data)
    this.restaurantOrders = [];
    console.log('🔵 Loading orders for restaurant:', restaurant.restaurantName);
  }

  // ✅ Close detail view and go back to list
  closeDetailView(): void {
    console.log('🔵 Closing detail view');
    this.showDetailView = false;
    this.selectedRestaurant = null;
    this.activeTab = 'restaurant';
    this.restaurantOrders = [];
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
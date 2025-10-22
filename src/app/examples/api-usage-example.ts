/**
 * API Usage Examples
 * 
 * This file demonstrates how to use the various services to connect
 * the Angular frontend with the ASP.NET Core backend API.
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RestaurantService, RestaurantUser } from '../services/restaurant.service';
import { AgentService, Agent } from '../services/agent.service';
import { VendorService, Vendor } from '../services/vendor.service';
import { RevenueService } from '../services/revenue.service';

// This is an example component - NOT meant to be used directly
// Copy the relevant code snippets to your actual components

@Component({
  selector: 'app-api-usage-example',
  template: `
    <div class="container">
      <h2>API Usage Examples</h2>
      <p>Check the TypeScript file for code examples</p>
    </div>
  `
})
export class ApiUsageExampleComponent implements OnInit {
  
  // Data properties
  restaurants: RestaurantUser[] = [];
  agents: Agent[] = [];
  vendors: Vendor[] = [];
  dashboardData: any;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private restaurantService: RestaurantService,
    private agentService: AgentService,
    private vendorService: VendorService,
    private revenueService: RevenueService
  ) {}

  ngOnInit() {
    // Check if user is authenticated
    this.isLoggedIn = this.authService.isAuthenticated();
    
    if (this.isLoggedIn) {
      // Load data if authenticated
      this.loadAllData();
    }
  }

  // ==================== AUTHENTICATION EXAMPLES ====================

  /**
   * Example 1: Login
   */
  exampleLogin() {
    const credentials = {
      username: 'user@example.com',  // Use 'email' based on backend
      password: 'password123'
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoggedIn = true;
        // Navigate to dashboard or load data
        this.loadAllData();
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check credentials.');
      }
    });
  }

  /**
   * Example 2: Logout
   */
  exampleLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    console.log('User logged out');
    // Navigate to login page
  }

  /**
   * Example 3: Check authentication status
   */
  exampleCheckAuth() {
    const token = this.authService.getToken();
    const isAuthenticated = this.authService.isAuthenticated();
    
    console.log('Token:', token);
    console.log('Is Authenticated:', isAuthenticated);
  }

  // ==================== RESTAURANT EXAMPLES ====================

  /**
   * Example 4: Get all approved restaurants
   */
  exampleGetRestaurants() {
    this.restaurantService.getAll('Approved').subscribe({
      next: (data) => {
        this.restaurants = data;
        console.log('Restaurants loaded:', data);
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
      }
    });
  }

  /**
   * Example 5: Get restaurant by ID
   */
  exampleGetRestaurantById(id: number) {
    this.restaurantService.getById(id).subscribe({
      next: (restaurant) => {
        console.log('Restaurant:', restaurant);
      },
      error: (error) => {
        console.error('Error loading restaurant:', error);
      }
    });
  }

  /**
   * Example 6: Create new restaurant
   */
  exampleCreateRestaurant() {
    const newRestaurant: Partial<RestaurantUser> = {
      fullName: 'Test Restaurant',
      email: 'test@restaurant.com',
      password: 'securePassword123',
      contactNumber: '1234567890',
      restaurantName: 'Test Restaurant Name',
      category: 'veg',
      countryCode: '91',
      address: 'Test Location'
    };

    this.restaurantService.create(newRestaurant).subscribe({
      next: (response) => {
        console.log('Restaurant created:', response);
        // Reload the list
        this.exampleGetRestaurants();
      },
      error: (error) => {
        console.error('Error creating restaurant:', error);
      }
    });
  }

  /**
   * Example 7: Search restaurants
   */
  exampleSearchRestaurants(searchQuery: string) {
    this.restaurantService.search(searchQuery).subscribe({
      next: (results) => {
        console.log('Search results:', results);
        this.restaurants = results;
      },
      error: (error) => {
        console.error('Search error:', error);
      }
    });
  }

  /**
   * Example 8: Delete restaurant
   */
  exampleDeleteRestaurant(id: number) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      this.restaurantService.delete(id).subscribe({
        next: () => {
          console.log('Restaurant deleted');
          // Reload the list
          this.exampleGetRestaurants();
        },
        error: (error) => {
          console.error('Error deleting restaurant:', error);
        }
      });
    }
  }

  /**
   * Example 9: Get dashboard data
   */
  exampleGetDashboard() {
    this.restaurantService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        console.log('Dashboard data:', data);
        
        // Access specific properties
        console.log('Revenue:', data.collectionData.revenue);
        console.log('Quantity:', data.collectionData.quantity);
        console.log('Oil Types:', data.collectionData.oil_types);
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
      }
    });
  }

  // ==================== AGENT EXAMPLES ====================

  /**
   * Example 10: Get all agents
   */
  exampleGetAgents() {
    this.agentService.getAll().subscribe({
      next: (data) => {
        this.agents = data;
        console.log('Agents loaded:', data);
      },
      error: (error) => {
        console.error('Error loading agents:', error);
      }
    });
  }

  /**
   * Example 11: Create new agent
   */
  exampleCreateAgent() {
    const newAgent: Partial<Agent> = {
      fullName: 'Test Agent',
      email: 'agent@example.com',
      password: 'securePassword123',
      contactNumber: '9876543210'
    };

    this.agentService.create(newAgent).subscribe({
      next: (response) => {
        console.log('Agent created:', response);
        this.exampleGetAgents();
      },
      error: (error) => {
        console.error('Error creating agent:', error);
      }
    });
  }

  /**
   * Example 12: Update agent
   */
  exampleUpdateAgent(id: number) {
    const updatedAgent: Partial<Agent> = {
      fullName: 'Updated Agent Name',
      email: 'updated@example.com',
      contactNumber: '1111111111'
    };

    this.agentService.update(id, updatedAgent).subscribe({
      next: (response) => {
        console.log('Agent updated:', response);
        this.exampleGetAgents();
      },
      error: (error) => {
        console.error('Error updating agent:', error);
      }
    });
  }

  // ==================== VENDOR EXAMPLES ====================

  /**
   * Example 13: Get all vendors
   */
  exampleGetVendors() {
    this.vendorService.getAll().subscribe({
      next: (data) => {
        this.vendors = data;
        console.log('Vendors loaded:', data);
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
      }
    });
  }

  // ==================== REVENUE EXAMPLES ====================

  /**
   * Example 14: Get revenue data
   */
  exampleGetRevenue() {
    this.revenueService.getRevenue().subscribe({
      next: (data) => {
        console.log('Revenue data:', data);
      },
      error: (error) => {
        console.error('Error loading revenue:', error);
      }
    });
  }

  /**
   * Example 15: Get monthly revenue
   */
  exampleGetMonthlyRevenue() {
    this.revenueService.getRevenueByPeriod('monthly').subscribe({
      next: (data) => {
        console.log('Monthly revenue:', data);
        // Use this data for charts
      },
      error: (error) => {
        console.error('Error loading monthly revenue:', error);
      }
    });
  }

  // ==================== COMBINED EXAMPLE ====================

  /**
   * Example 16: Load all data for dashboard
   */
  loadAllData() {
    // Load multiple data sources in parallel
    this.exampleGetRestaurants();
    this.exampleGetAgents();
    this.exampleGetVendors();
    this.exampleGetDashboard();
    this.exampleGetRevenue();
  }

  // ==================== ERROR HANDLING PATTERNS ====================

  /**
   * Example 17: Comprehensive error handling
   */
  exampleWithErrorHandling() {
    this.restaurantService.getAll().subscribe({
      next: (data) => {
        // Success handling
        this.restaurants = data;
      },
      error: (error) => {
        // Error handling based on status code
        if (error.status === 401) {
          console.error('Unauthorized - please login');
          // Redirect to login
        } else if (error.status === 404) {
          console.error('Resource not found');
        } else if (error.status === 500) {
          console.error('Server error');
        } else {
          console.error('An error occurred:', error.message);
        }
      },
      complete: () => {
        // Cleanup or post-processing
        console.log('Request completed');
      }
    });
  }

  /**
   * Example 18: Loading state management
   */
  exampleWithLoadingState() {
    let loading = true;

    this.restaurantService.getAll().subscribe({
      next: (data) => {
        this.restaurants = data;
        loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        loading = false;
      }
    });
  }
}

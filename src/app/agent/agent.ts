import { Component, Input } from '@angular/core';

export interface RestaurantData {
  owner: string;
  status: string;
  dob: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  licenseNo: string;
}

@Component({
  selector: 'app-agent',
  standalone: false,
  templateUrl: './agent.html',
  styleUrl: './agent.scss'
})
export class Agent {
  @Input() showOnlyTable: boolean = false; // Add this input property
  @Input() externalAgents: RestaurantData[] = []; // Optional: to pass data from parent

  searchText: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  activeTab: string = 'overall';

  restaurants: RestaurantData[] = [
    {
      owner: 'Ayesha',
      status: 'Active',
      dob: '03/07/2003',
      age: 23,
      gender: 'Female',
      email: 'ayesha@13sake.in',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Bhavna Goyal',
      status: 'Active',
      dob: '03/07/2003',
      age: 34,
      gender: 'Male',
      email: 'Ester123@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Paartho Ghosh',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 65,
      gender: 'Female',
      email: 'Savannhobai@yahoo.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Ramesh Gupta',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 56,
      gender: 'Male',
      email: 'Ester123@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Mohd Hadi',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 45,
      gender: 'Male',
      email: 'Fisherman12@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Kailash Chaurasla',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 28,
      gender: 'Male',
      email: 'Savannhobai@yahoo.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Sumit Bhadouriya',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 49,
      gender: 'Female',
      email: 'Joneshighman@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Shaoni Jain',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 34,
      gender: 'Female',
      email: 'Fisherman12@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Mamta Lodhi',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 28,
      gender: 'Male',
      email: 'Jamescooper@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Nandan Rathwar',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 65,
      gender: 'Female',
      email: 'Fisherman12@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Vishwas Patel',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 36,
      gender: 'Male',
      email: 'Joneshighman@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    },
    {
      owner: 'Navjot Kaur',
      status: 'Inactive',
      dob: '03/07/2003',
      age: 41,
      gender: 'Male',
      email: 'Jamescooper@gmail.com',
      phone: '+91 98912 56354',
      licenseNo: 'TN77272'
    }
  ];

  filteredRestaurants: RestaurantData[] = [];

  ngOnInit(): void {
    if (!this.showOnlyTable) {
      this.filteredRestaurants = [...this.restaurants];
    } else {
      // Use external data if provided, otherwise use initialized data
      this.filteredRestaurants = this.externalAgents.length > 0 ? this.externalAgents : [...this.restaurants];
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSearch(): void {
    if (!this.searchText.trim()) {
      this.filteredRestaurants = [...this.restaurants];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredRestaurants = this.restaurants.filter(restaurant =>
      restaurant.owner.toLowerCase().includes(searchLower) ||
      restaurant.status.toLowerCase().includes(searchLower) ||
      restaurant.email.toLowerCase().includes(searchLower) ||
      restaurant.gender.toLowerCase().includes(searchLower)
    );
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
}
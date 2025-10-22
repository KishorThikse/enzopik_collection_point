import { Component,ViewEncapsulation  } from '@angular/core';
import { RestaurantData } from '../agent/agent';

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
  age?: number;
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

interface Document {
  id: string;
  documentName: string;
  action?: string;
}

@Component({
  selector: 'app-hubs',
  standalone: false,
  templateUrl: './hubs.html',
  styleUrl: './hubs.scss',
  encapsulation: ViewEncapsulation.None  
})
export class Hubs {
  activeTab: 'all' | 'onboarding' = 'all';
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 10;
  selectedHub: HubData | null = null;
  showDetailView: boolean = false;
  detailActiveTab: string = 'hub-incharge';
  hubOrders: Order[] = [];
   hubAgents: RestaurantData[] = []; 
  hubDocuments: Document[] = [];
 

  hubsData: HubData[] = [
    {
      hubName: 'Pondicherry Hub',
      city: 'Pondicherry',
      area: 'MG Road',
      inchargeName: 'Harith',
      inchargeAvatar: 'https://i.pravatar.cc/32?img=1',
      status: 'Active',
      email: 'collectionpoint@gmail.com',
      contact: '+91 98979 76684',
      address: '97, first floor, easwaran Kovil street.',
      state: 'Puducherry',
      pincode: '605001',
      country: 'India',
      gender: 'Male',
      age: 28,
      odooCode: '01',
      idNumber: '01',
      emailAddress: 'collectionpoint@gmail.com',
      hubIncharge: 'Harith',
      inchargeContact: '+91 98979 76684',
      hubNumber: '+91 90223 35588',
      numberOfAgents: 81,
      numberOfOrders: 22,
      totalOilCollected: '220kg'
    },
    {
      hubName: 'Chennai Hub',
      city: 'Chennai',
      area: 'Perlilapuram',
      inchargeName: 'Agnia',
      inchargeAvatar: 'https://i.pravatar.cc/32?img=2',
      status: 'Active',
      email: 'Sethul@2hiloes.in',
      contact: '+91 98013 58354',
      address: '80, First floor, ebenezer love street',
      state: 'Tamil Nadu',
      pincode: '628001',
      country: 'India',
      gender: 'Male',
      age: 28,
      odooCode: '02',
      idNumber: '02',
      emailAddress: 'mentudez@gmail.com',
      hubIncharge: 'Agnia',
      inchargeContact: '+91 98013 58354',
      hubNumber: '+91 90223 35588',
      numberOfAgents: 65,
      numberOfOrders: 18,
      totalOilCollected: '180kg'
    },
    {
      hubName: 'Maapar Hub',
      city: 'Thane',
      area: 'Snornag Nagar',
      inchargeName: 'Bhumit Goyel',
      inchargeAvatar: 'https://i.pravatar.cc/32?img=3',
      status: 'Active',
      email: 'Ezzas.t23@gmail.com',
      contact: '+91 98013 58354',
      address: 'Snornag Nagar, Thane',
      state: 'Maharashtra',
      pincode: '400601',
      country: 'India',
      gender: 'Male',
      age: 32,
      odooCode: '03',
      idNumber: '03',
      emailAddress: 'Ezzas.t23@gmail.com',
      hubIncharge: 'Bhumit Goyel',
      inchargeContact: '+91 98013 58354',
      hubNumber: '+91 90223 35588',
      numberOfAgents: 75,
      numberOfOrders: 20,
      totalOilCollected: '200kg'
    },
    {
      hubName: 'Bengaluru Hub',
      city: 'Bengaluru',
      area: 'Arekikled',
      inchargeName: 'Paushos Ghosh',
      inchargeAvatar: 'https://i.pravatar.cc/32?img=4',
      status: 'Inactive',
      email: 'Ravaishekibdu@yahoo.com',
      contact: '+91 98013 58354',
      address: 'Arekikled, Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
      gender: 'Male',
      age: 35,
      odooCode: '04',
      idNumber: '04',
      emailAddress: 'Ravaishekibdu@yahoo.com',
      hubIncharge: 'Paushos Ghosh',
      inchargeContact: '+91 98013 58354',
      hubNumber: '+91 90223 35588',
      numberOfAgents: 50,
      numberOfOrders: 12,
      totalOilCollected: '120kg'
    }
  ];

  setActiveTab(tab: 'all' | 'onboarding'): void {
    this.activeTab = tab;
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

  openHubDetail(hub: HubData): void {
    this.selectedHub = hub;
    this.showDetailView = true;
    this.loadHubOrders(hub);
    this.loadHubDocuments(hub);
    this.loadHubAgents(hub); 
  }

  closeHubDetail(): void {
    this.showDetailView = false;
    this.selectedHub = null;
    this.hubOrders = [];
    this.hubDocuments = [];
  }

  setDetailTab(tab: string): void {
    this.detailActiveTab = tab;
  }

  loadHubOrders(hub: HubData): void {
    // Load orders specific to this hub
    this.hubOrders = [];
  }

  loadHubAgents(hub: HubData): void {
    // In a real application, fetch agents from API based on the hub
    // For now, use empty array (component will use its default data)
    this.hubAgents = [];
  }

  loadHubDocuments(hub: HubData): void {
    this.hubDocuments = [
      {
        id: '1',
        documentName: 'CV_Resam.x.pdf',
        action: 'download'
      }
    ];
  }

  deleteDocument(index: number): void {
    this.hubDocuments.splice(index, 1);
  }

  downloadDocument(doc: Document): void {
    console.log('Downloading:', doc.documentName);
  }
}
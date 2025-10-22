import { Component, Input } from '@angular/core';

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
  selector: 'app-oil',
  standalone: false,
  templateUrl: './oil.html',
  styleUrl: './oil.scss'
})
export class Oil {
  @Input() showOnlyTable: boolean = false; // Add this input property
  @Input() externalOrders: Order[] = []; // Optional: to pass data from parent
  
  searchText: string = '';
  orders: Order[] = [];

  ngOnInit(): void {
    if (!this.showOnlyTable) {
      this.initializeOrders();
    } else {
      // Use external data if provided, otherwise use initialized data
      this.orders = this.externalOrders.length > 0 ? this.externalOrders : [];
      if (this.orders.length === 0) {
        this.initializeOrders(); // Fallback to default data
      }
    }
  }

  initializeOrders(): void {
    this.orders = [
      {
        repName: 'Hotel Abi',
        oilType: 'Palm oil',
        country: '40KG',
        amount: 2000,
        orderedBy: { name: 'Aysha', avatar: 'https://i.pravatar.cc/150?img=1' },
        date: '12/06/2010',
        unitName: 'Chennai hub',
        status: 'Assigned'
      },
      {
        repName: 'Hotel Anbu',
        oilType: 'Palm oil',
        country: '70KG',
        amount: 3000,
        orderedBy: { name: 'Bhavana Goyal', avatar: 'https://i.pravatar.cc/150?img=2' },
        date: '28/10/2010',
        unitName: 'Nagpur hub',
        status: 'Pending'
      },
      {
        repName: 'Four Points',
        oilType: 'Coconut oil',
        country: '178KG',
        amount: 1000,
        orderedBy: { name: 'Paartho Ghosh', avatar: 'https://i.pravatar.cc/150?img=3' },
        date: '18/09/2010',
        unitName: 'Bangalore hub',
        status: 'Accepted'
      },
      {
        repName: 'Quality Inn & Suites',
        oilType: 'Coconut oil',
        country: '940KG',
        amount: 1000,
        orderedBy: { name: 'Ramesh Gupta', avatar: 'https://i.pravatar.cc/150?img=4' },
        date: '07/05/2016',
        unitName: 'Patna hub',
        status: 'Collection_acknowledge'
      },
      {
        repName: 'Gol International',
        oilType: 'Used Cooking oil',
        country: '420KG',
        amount: 43450,
        orderedBy: { name: 'Ravi Kumar', avatar: 'https://i.pravatar.cc/150?img=5' },
        date: '11/10/2010',
        unitName: 'Mumbai hub',
        status: 'Fbo_acknowledge'
      },
      {
        repName: 'Comfort Inc',
        oilType: 'Used cooking oil',
        country: '2670KG',
        amount: 43532,
        orderedBy: { name: 'Shahnaz Chanaksa', avatar: 'https://i.pravatar.cc/150?img=6' },
        date: '29/07/2012',
        unitName: 'Mumbai hub',
        status: 'Agent_acknowledge'
      },
      {
        repName: 'Chemcard Air Material',
        oilType: 'Used cooking oil',
        country: '670KG',
        amount: 43450,
        orderedBy: { name: 'Turvi Bhadesia', avatar: 'https://i.pravatar.cc/150?img=7' },
        date: '11/09/2017',
        unitName: 'Delhi hub',
        status: 'Fbo_acknowledge'
      },
      {
        repName: 'Hangout Inc',
        oilType: 'Coconut oil',
        country: '140KG',
        amount: 43450,
        orderedBy: { name: 'Nithin arun', avatar: 'https://i.pravatar.cc/150?img=8' },
        date: '13/07/2012',
        unitName: 'Online hub',
        status: 'Completed'
      },
      {
        repName: 'Best Western Plus',
        oilType: 'Coconut oil',
        country: '940KG',
        amount: 43422,
        orderedBy: { name: 'Marsha Lewis', avatar: 'https://i.pravatar.cc/150?img=9' },
        date: '16/03/2014',
        unitName: 'Hyderabad hub',
        status: 'Agent_acknowledge'
      },
      {
        repName: 'Holistic Worldtripps',
        oilType: 'Sunflower oil',
        country: '440KG',
        amount: 43450,
        orderedBy: { name: 'Nivedita Nellutri', avatar: 'https://i.pravatar.cc/150?img=10' },
        date: '16/11/2016',
        unitName: 'Prime hub',
        status: 'Collection_acknowledge'
      },
      {
        repName: 'Hangout Inc',
        oilType: 'Sunflower oil',
        country: '400KG',
        amount: 43450,
        orderedBy: { name: 'Nidhin G', avatar: 'https://i.pravatar.cc/150?img=11' },
        date: '13/07/2012',
        unitName: 'Yelena hub',
        status: 'Completed'
      },
      {
        repName: 'Hangout Inc',
        oilType: 'Sunflower oil',
        country: '400KG',
        amount: 43450,
        orderedBy: { name: 'Nidhin G', avatar: 'https://i.pravatar.cc/150?img=12' },
        date: '16/02/2010',
        unitName: 'Helena hub',
        status: 'Completed'
      },
      {
        repName: 'Hangout Inc',
        oilType: 'Sunflower oil',
        country: '400KG',
        amount: 43450,
        orderedBy: { name: 'Nidhin Arun', avatar: 'https://i.pravatar.cc/150?img=13' },
        date: '16/08/2010',
        unitName: 'Helena hub',
        status: 'Completed'
      }
    ];
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Assigned': 'status-assigned',
      'Pending': 'status-pending',
      'Accepted': 'status-accepted',
      'Collection_acknowledge':'status-collection',
      'Fbo_acknowledge':'status-fbo',
      'Agent_acknowledge':'status-agent',
      'Completed': 'status-completed'
    };
    return statusMap[status] || '';
  }
}
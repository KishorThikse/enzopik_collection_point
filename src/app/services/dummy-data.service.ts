import { Injectable } from '@angular/core';
import { DashboardSummary, OilTypeSummary } from './dashboard.service';
import { RevenueData } from './revenue.service';
import { RestaurantUser } from './restaurant.service';
import { Vendor } from './vendor.service';
import { Agent } from './agent.service';
import { OilOrder } from './oil.service';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  constructor() { }

  /**
   * Returns dummy dashboard summary statistics
   */
  getDummySummaryData(): DashboardSummary {
    return {
      message: 'Success',
      status: '200',
      totalFBO: 156,
      totalAgent: 89,
      totalHubs: 24,
      totalOilCollected: 8028
    };
  }

  /**
   * Returns dummy revenue data based on the specified period
   */
  getDummyRevenueData(period: 'today' | 'monthly' | 'yearly'): RevenueData[] {
    switch (period) {
      case 'today':
        return this.getTodayDummyData();
      case 'monthly':
        return this.getMonthlyDummyData();
      case 'yearly':
        return this.getYearlyDummyData();
      default:
        return this.getMonthlyDummyData();
    }
  }

  /**
   * Returns dummy oil type summary data for donut chart
   */
  getDummyOilSummaryData(): OilTypeSummary[] {
    return [
      {
        type: 'Used Cooking Oil',
        totalQuantityKg: 3450,
        totalAmount: 172500,
        count: 145
      },
      {
        type: 'Sunflower Oil',
        totalQuantityKg: 2180,
        totalAmount: 109000,
        count: 92
      },
      {
        type: 'Palm Oil',
        totalQuantityKg: 1890,
        totalAmount: 94500,
        count: 78
      },
      {
        type: 'Coconut Oil',
        totalQuantityKg: 508,
        totalAmount: 25400,
        count: 21
      }
    ];
  }

  /**
   * Private helper: Returns hourly data for today
   */
  private getTodayDummyData(): RevenueData[] {
    return [
      { date: '00:00', amount: 45 },
      { date: '04:00', amount: 32 },
      { date: '08:00', amount: 78 },
      { date: '12:00', amount: 95 },
      { date: '16:00', amount: 112 },
      { date: '20:00', amount: 88 },
      { date: '23:59', amount: 67 }
    ];
  }

  /**
   * Private helper: Returns monthly data for current year
   */
  private getMonthlyDummyData(): RevenueData[] {
    return [
      { date: 'Jan', amount: 650 },
      { date: 'Feb', amount: 720 },
      { date: 'Mar', amount: 580 },
      { date: 'Apr', amount: 890 },
      { date: 'May', amount: 760 },
      { date: 'Jun', amount: 920 },
      { date: 'Jul', amount: 850 },
      { date: 'Aug', amount: 980 },
      { date: 'Sep', amount: 870 },
      { date: 'Oct', amount: 1050 },
      { date: 'Nov', amount: 940 },
      { date: 'Dec', amount: 1100 }
    ];
  }

  /**
   * Private helper: Returns yearly data
   */
  private getYearlyDummyData(): RevenueData[] {
    return [
      { date: '2019', amount: 7200 },
      { date: '2020', amount: 8500 },
      { date: '2021', amount: 9800 },
      { date: '2022', amount: 11200 },
      { date: '2023', amount: 13500 },
      { date: '2024', amount: 15800 }
    ];
  }

  /**
   * Returns dummy restaurant users data
   */
  getDummyRestaurants(status?: string): RestaurantUser[] {
    const allRestaurants: RestaurantUser[] = [
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

    // Filter by status if provided
    if (status) {
      return allRestaurants.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    return allRestaurants;
  }

  /**
   * Returns dummy vendors (agents) data
   */
  getDummyVendors(status?: string): Vendor[] {
    const allVendors: Vendor[] = [
      {
        id: 1,
        fullName: 'Arjun Mehta',
        dob: '1990-05-15',
        age: 34,
        gender: 'Male',
        countryCode: '91',
        contactNumber: '9988776655',
        email: 'arjun.mehta@example.com',
        licenseNumber: 'VL001234',
        pincode: '560001',
        address: '45 MG Road, Bangalore',
        profile: 'https://i.pravatar.cc/150?img=11',
        status: 'Approved'
      },
      {
        id: 2,
        fullName: 'Kavya Nair',
        dob: '1992-08-22',
        age: 32,
        gender: 'Female',
        countryCode: '91',
        contactNumber: '9988776656',
        email: 'kavya.nair@example.com',
        licenseNumber: 'VL001235',
        pincode: '560025',
        address: '78 Brigade Road, Bangalore',
        profile: 'https://i.pravatar.cc/150?img=12',
        status: 'Approved'
      },
      {
        id: 3,
        fullName: 'Vikram Singh',
        dob: '1988-03-10',
        age: 36,
        gender: 'Male',
        countryCode: '91',
        contactNumber: '9988776657',
        email: 'vikram.singh@example.com',
        licenseNumber: 'VL001236',
        pincode: '560034',
        address: '123 Koramangala, Bangalore',
        profile: 'https://i.pravatar.cc/150?img=13',
        status: 'Approved'
      },
      {
        id: 4,
        fullName: 'Ananya Reddy',
        dob: '1995-11-30',
        age: 29,
        gender: 'Female',
        countryCode: '91',
        contactNumber: '9988776658',
        email: 'ananya.reddy@example.com',
        licenseNumber: 'VL001237',
        pincode: '560038',
        address: '56 Indiranagar, Bangalore',
        profile: 'https://i.pravatar.cc/150?img=14',
        status: 'Pending'
      },
      {
        id: 5,
        fullName: 'Rohan Kapoor',
        dob: '1991-07-18',
        age: 33,
        gender: 'Male',
        countryCode: '91',
        contactNumber: '9988776659',
        email: 'rohan.kapoor@example.com',
        licenseNumber: 'VL001238',
        pincode: '560066',
        address: '89 Whitefield, Bangalore',
        profile: 'https://i.pravatar.cc/150?img=15',
        status: 'Approved'
      }
    ];

    // Filter by status if provided
    if (status) {
      return allVendors.filter(v => v.status?.toLowerCase() === status.toLowerCase());
    }

    return allVendors;
  }

  /**
   * Returns dummy agents data
   */
  getDummyAgents(): Agent[] {
    return [
      {
        id: 1,
        fullName: 'Suresh Kumar',
        email: 'suresh.kumar@example.com',
        contactNumber: '9876543220',
        location: 'Bangalore North',
        status: 'Active'
      },
      {
        id: 2,
        fullName: 'Meena Patel',
        email: 'meena.patel@example.com',
        contactNumber: '9876543221',
        location: 'Bangalore South',
        status: 'Active'
      },
      {
        id: 3,
        fullName: 'Ramesh Iyer',
        email: 'ramesh.iyer@example.com',
        contactNumber: '9876543222',
        location: 'Bangalore East',
        status: 'Inactive'
      }
    ];
  }

  /**
   * Returns dummy oil orders data
   */
  getDummyOilOrders(): OilOrder[] {
    return [
      {
        order_id: 1,
        type: 'Used Cooking Oil',
        quantity: '50',
        status: 'Assigned',
        user_id: 101,
        proposed_unit_price: '35',
        counter_unit_price: '35',
        amount: '1750',
        vendor_id: 1,
        vendor_name: 'Arjun Mehta',
        vendor_status: 'Approved',
        agent_id: 1,
        oil_quality: 'Good',
        oil_image: null,
        user_name: 'Rajesh Kumar',
        user_contact: '+91 9876543210',
        registered_address: '123 MG Road, Bangalore-560001',
        restaurant_name: 'Spice Garden',
        hub_name: 'Central Hub',
        timeline: '2024-01-15',
        pickup_location: '123 MG Road, Bangalore',
        payment_method: 'Cash',
        date: '2024-01-15',
        time: '10:30:00',
        available_vendors: [
          { id: 1, fullName: 'Arjun Mehta' },
          { id: 2, fullName: 'Kavya Nair' }
        ],
        agreed_price: '35'
      },
      {
        order_id: 2,
        type: 'Sunflower Oil',
        quantity: '30',
        status: 'Pending',
        user_id: 102,
        proposed_unit_price: '32',
        counter_unit_price: '32',
        amount: '960',
        vendor_id: 2,
        vendor_name: 'Kavya Nair',
        vendor_status: 'Approved',
        agent_id: 2,
        oil_quality: 'Excellent',
        oil_image: null,
        user_name: 'Priya Sharma',
        user_contact: '+91 9876543211',
        registered_address: '456 Brigade Road, Bangalore-560025',
        restaurant_name: 'Green Leaf Cafe',
        hub_name: 'South Hub',
        timeline: '2024-01-16',
        pickup_location: '456 Brigade Road, Bangalore',
        payment_method: 'Online',
        date: '2024-01-16',
        time: '14:00:00',
        available_vendors: [
          { id: 2, fullName: 'Kavya Nair' },
          { id: 3, fullName: 'Vikram Singh' }
        ],
        agreed_price: '32'
      },
      {
        order_id: 3,
        type: 'Palm Oil',
        quantity: '75',
        status: 'Accepted',
        user_id: 103,
        proposed_unit_price: '38',
        counter_unit_price: '38',
        amount: '2850',
        vendor_id: 3,
        vendor_name: 'Vikram Singh',
        vendor_status: 'Approved',
        agent_id: 3,
        oil_quality: 'Good',
        oil_image: null,
        user_name: 'Mohammed Ali',
        user_contact: '+91 9876543212',
        registered_address: '789 Commercial Street, Bangalore-560001',
        restaurant_name: 'Biryani House',
        hub_name: 'Central Hub',
        timeline: '2024-01-17',
        pickup_location: '789 Commercial Street, Bangalore',
        payment_method: 'Cash',
        date: '2024-01-17',
        time: '11:15:00',
        available_vendors: [
          { id: 3, fullName: 'Vikram Singh' },
          { id: 5, fullName: 'Rohan Kapoor' }
        ],
        agreed_price: '38'
      },
      {
        order_id: 4,
        type: 'Coconut Oil',
        quantity: '20',
        status: 'Completed',
        user_id: 104,
        proposed_unit_price: '40',
        counter_unit_price: '40',
        amount: '800',
        vendor_id: 5,
        vendor_name: 'Rohan Kapoor',
        vendor_status: 'Approved',
        agent_id: 1,
        oil_quality: 'Excellent',
        oil_image: null,
        user_name: 'Sneha Reddy',
        user_contact: '+91 9876543215',
        registered_address: '987 Whitefield, Bangalore-560066',
        restaurant_name: 'Coastal Kitchen',
        hub_name: 'East Hub',
        timeline: '2024-01-14',
        pickup_location: '987 Whitefield, Bangalore',
        payment_method: 'Online',
        date: '2024-01-14',
        time: '09:00:00',
        available_vendors: [
          { id: 5, fullName: 'Rohan Kapoor' }
        ],
        agreed_price: '40'
      },
      {
        order_id: 5,
        type: 'Used Cooking Oil',
        quantity: '60',
        status: 'Pending',
        user_id: 105,
        proposed_unit_price: '36',
        counter_unit_price: '36',
        amount: '2160',
        vendor_id: 1,
        vendor_name: 'Arjun Mehta',
        vendor_status: 'Approved',
        agent_id: 2,
        oil_quality: 'Good',
        oil_image: null,
        user_name: 'Amit Patel',
        user_contact: '+91 9876543214',
        registered_address: '654 Koramangala, Bangalore-560034',
        restaurant_name: 'Tandoor Express',
        hub_name: 'South Hub',
        timeline: '2024-01-18',
        pickup_location: '654 Koramangala, Bangalore',
        payment_method: 'Cash',
        date: '2024-01-18',
        time: '16:30:00',
        available_vendors: [
          { id: 1, fullName: 'Arjun Mehta' },
          { id: 2, fullName: 'Kavya Nair' }
        ],
        agreed_price: '36'
      }
    ];
  }
}

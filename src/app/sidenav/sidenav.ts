import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  standalone: false,
  styleUrls: ['./sidenav.scss']
})
export class Sidenav implements OnInit {
  
  isOpen: boolean = true;
  isCollapsed: boolean = false; // New property for desktop collapse
  isMobile: boolean = false;
  activeRoute: string = 'home';

  // Topnav properties
  pageTitle: string = 'Dashboard';
  showNotifications: boolean = false;
  showProfile: boolean = false;
  unreadCount: number = 0;

  // Static user profile (replace with actual data from service later)
  userProfile: UserProfile = {
    name: '',
    email: '',
    role: '',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4CAF50&color=fff&size=128'
  };

  // Static notifications (replace with actual data from service later)
  notifications: Notification[] = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'You have received a new oil collection order from La Penel Park',
      time: '5 minutes ago',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Payment Pending',
      message: 'Payment for order #12345 is still pending',
      time: '1 hour ago',
      type: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'System Update',
      message: 'System maintenance scheduled for tonight at 11 PM',
      time: '3 hours ago',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'New Candidate Applied',
      message: 'John Smith has applied for the Agent position',
      time: '5 hours ago',
      type: 'success',
      read: false
    },
    {
      id: 5,
      title: 'Low Stock Alert',
      message: 'Oil collection containers running low in warehouse',
      time: '1 day ago',
      type: 'warning',
      read: true
    }
  ];

  constructor(
    private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object
) {}



  ngOnInit(): void {
    this.checkScreenSize();
    this.setActiveRoute();
    this.updateUnreadCount();
    
    // Listen to route changes to update active state and page title
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveRoute();
      this.updatePageTitle();
    });
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement;
    if (!target.closest('.notification-wrapper') && !target.closest('.profile-wrapper')) {
      this.showNotifications = false;
      this.showProfile = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }


 checkScreenSize(): void {
 
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      if (this.isMobile) {
        this.isOpen = false;
        this.isCollapsed = false;
      } else {
        this.isOpen = true;
      }
    }
  }
  toggleSidenav(): void {
    this.isOpen = !this.isOpen;
  }

  
  toggleCollapse(): void {
    if (!this.isMobile) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  navigateTo(route: string): void {
    this.activeRoute = route;
    this.router.navigate([`/${route}`]);
    
    // Close sidenav on mobile after navigation
    if (this.isMobile) {
      this.isOpen = false;
    }

    // Close dropdowns
    this.showNotifications = false;
    this.showProfile = false;
  }

  setActiveRoute(): void {
    const currentRoute = this.router.url.split('/')[1];
    this.activeRoute = currentRoute || 'home';
  }

  updatePageTitle(): void {
    // Update page title based on current route
    const routeTitles: { [key: string]: string } = {
      'home': 'Dashboard',
      'sub-agent': 'Sub Agents',
      'restaurant': 'Restaurants & PBO',
      'agent': 'Agents',
      'orders': 'Oil Orders',
      'account': 'Account Settings',
      'profile': 'My Profile',
      'settings': 'Settings',
      'help': 'Help & Support',
      'notifications': 'All Notifications'
    };

    this.pageTitle = routeTitles[this.activeRoute] || 'Dashboard';
  }


  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
    this.updateUnreadCount();
    console.log('Marked notification as read:', notification.id);
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateUnreadCount();
    console.log('Marked all notifications as read');
  }

  viewAllNotifications(): void {
    this.showNotifications = false;
    this.router.navigate(['/notifications']);
    console.log('Navigating to notifications page');
  }


  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  logout(): void {
    this.showProfile = false;
    this.showNotifications = false;
    console.log('Logging out...');
    
    this.router.navigate(['/login']);
  }

 
  
  updateUserProfile(profile: UserProfile): void {
    this.userProfile = profile;
  }

  addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
    this.updateUnreadCount();
  }

  loadNotifications(): void {
    // TODO: Replace with actual API call
  }

  loadUserProfile(): void {
    // TODO: Replace with actual API call
  }
}
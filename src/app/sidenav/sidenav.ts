import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService, Notification as BackendNotification } from '../services/notification.service';
import { OilService } from '../services/oil.service';

interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
  orderId?: number;
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
  isCollapsed: boolean = false;
  isMobile: boolean = false;
  activeRoute: string = 'home';

  // Topnav properties
  pageTitle: string = 'Dashboard';
  showNotifications: boolean = false;
  showProfile: boolean = false;
  unreadCount: number = 0;

  userProfile: UserProfile = {
    name: '',
    email: '',
    role: '',
    avatar: 'https://ui-avatars.com/api/?name=User&background=4CAF50&color=fff&size=128'
  };

  notifications: AppNotification[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private oilService: OilService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.setActiveRoute();

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userProfile.name = user.name || user.UserName || user.FullName || 'User';
        this.userProfile.email = user.email || user.Email || '';
        this.userProfile.role = user.role || user.Role || 'Customer';
        this.loadNotifications();
      }
    });

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
    if (this.isMobile) {
      this.isOpen = false;
    }
    this.showNotifications = false;
    this.showProfile = false;
  }

  setActiveRoute(): void {
    const currentRoute = this.router.url.split('/')[1]?.split('?')[0];
    this.activeRoute = currentRoute || 'home';
  }

  updatePageTitle(): void {
    const routeTitles: { [key: string]: string } = {
      'home': 'Dashboard',
      'hubs': 'Management Hubs',
      'restaurant': 'Restaurants & FBO',
      'agent': 'Registered Agents',
      'oil': 'Oil Sale Orders',
      'nearest-order': 'Nearby Collection Points',
      'account': 'Account Settings',
      'profile': 'My Profile',
      'settings': 'System Settings'
    };

    this.pageTitle = routeTitles[this.activeRoute] || 'Enzopik';
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
    if (this.showNotifications) {
      this.loadNotifications();
    }
  }

  updateUnreadCount(): void {
    const user = this.authService.currentUserValue;
    if (!user) return;
    const ownerId = user.id || user.Id || user.userId;
    const roleName = user.role || user.Role || '';

    this.notificationService.getUnreadCount(ownerId, roleName).subscribe(res => {
      this.unreadCount = res.unreadCount;
    });
  }

  markAsRead(notification: AppNotification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.updateUnreadCount();
      });
    }

    if (notification.orderId) {
      this.router.navigate(['/oil'], { queryParams: { orderId: notification.orderId } });
      this.showNotifications = false;
    }
  }

  markAllAsRead(): void {
    const unread = this.notifications.filter(n => !n.read);
    unread.forEach(n => this.markAsRead(n));
  }

  viewAllNotifications(): void {
    this.showNotifications = false;
    this.router.navigate(['/notifications']);
  }

  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  logout(): void {
    this.showProfile = false;
    this.showNotifications = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadNotifications(): void {
    const user = this.authService.currentUserValue;
    if (!user) return;
    this.updateUnreadCount();
    this.oilService.getAllDashboardData().subscribe(orders => {
      this.notifications = orders.slice(0, 5).map(order => ({
        id: order.order_id,
        title: `Entry Update`,
        message: `${order.restaurant_name} order update.`,
        time: order.date,
        type: 'info' as const,
        read: order.status !== 'pending',
        orderId: order.order_id
      }));
    });
  }
}
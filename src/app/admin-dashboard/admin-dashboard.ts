import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: false,
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
    activeTab: 'dashboard' | 'admins' | 'agents' | 'hubs' | 'add-admin' | 'approvals' = 'dashboard';
    isLoading = false;
    dashboardData: any = null;
    adminList: any[] = [];
    agentsList: any[] = [];
    hubsList: any[] = [];
    pendingVendors: any[] = [];
    pendingRestaurants: any[] = [];

    // Admin Form Modal
    showAdminModal = false;
    isEditMode = false;
    currentAdminId: number | null = null;
    adminForm = {
        fullName: '',
        email: '',
        contactNumber: '',
        password: '',
        companyName: 'Enzo Corporate',
        companyAddress: 'Main Hub',
        countryCode: '+1',
        profile: 'active'
    };

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.loadDashboard();
        this.loadAdmins();
        this.loadAgents();
        this.loadHubs();
        this.loadPendingApprovals();
    }

    changeTab(tab: 'dashboard' | 'admins' | 'agents' | 'hubs' | 'add-admin' | 'approvals'): void {
        this.activeTab = tab;
        if (tab === 'dashboard') this.loadDashboard();
        if (tab === 'admins') this.loadAdmins();
        if (tab === 'agents') this.loadAgents();
        if (tab === 'hubs') this.loadHubs();
        if (tab === 'add-admin') this.initAddAdmin();
        if (tab === 'approvals') this.loadPendingApprovals();
    }

    initAddAdmin(): void {
        this.isEditMode = false;
        this.currentAdminId = null;
        this.adminForm = {
            fullName: '',
            email: '',
            contactNumber: '',
            password: '',
            companyName: '',
            companyAddress: '',
            countryCode: '',
            profile: 'active'
        };
    }

    loadDashboard(): void {
        this.isLoading = true;
        this.adminService.getDashboardData().subscribe({
            next: (res) => {
                this.dashboardData = res.collectionData;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Dashboard error', err);
                this.isLoading = false;
            }
        });
    }

    loadAdmins(): void {
        this.isLoading = true;
        this.adminService.getAdminList().subscribe({
            next: (res) => {
                this.adminList = res;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Admin list error', err);
                this.isLoading = false;
            }
        });
    }

    loadAgents(): void {
        this.isLoading = true;
        this.adminService.getAgentsList().subscribe({
            next: (res) => {
                this.agentsList = res;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Agents error', err);
                this.isLoading = false;
            }
        });
    }

    loadHubs(): void {
        this.isLoading = true;
        this.adminService.getHubsList().subscribe({
            next: (res) => {
                this.hubsList = res;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Hubs error', err);
                this.isLoading = false;
            }
        });
    }

    loadPendingApprovals(): void {
        this.isLoading = true;
        this.adminService.getPendingVendors().subscribe(v => this.pendingVendors = v);
        this.adminService.getPendingRestaurants().subscribe(r => {
            this.pendingRestaurants = r;
            this.isLoading = false;
        });
    }

    onApproveVendor(id: number): void {
        // Auto-assign to the first available Hub to simplify UX
        const hubId = this.hubsList.length > 0 ? this.hubsList[0].id : 0;

        this.adminService.approveVendor(id, 'approved', hubId).subscribe({
            next: () => {
                alert('Agent approved successfully!');
                this.loadPendingApprovals();
                this.loadAgents();
            }
        });
    }

    onRejectVendor(id: number): void {
        if (!confirm('Reject this agent?')) return;
        this.adminService.approveVendor(id, 'rejected').subscribe({
            next: () => this.loadPendingApprovals()
        });
    }

    onApproveRestaurant(id: number): void {
        // Auto-assign to the first available Hub
        const hubId = this.hubsList.length > 0 ? this.hubsList[0].id : 0;

        this.adminService.approveRestaurant(id, 'approved', hubId).subscribe({
            next: () => {
                alert('Restaurant approved successfully!');
                this.loadPendingApprovals();
            }
        });
    }

    onRejectRestaurant(id: number): void {
        if (!confirm('Reject this restaurant?')) return;
        this.adminService.approveRestaurant(id, 'rejected').subscribe({
            next: () => this.loadPendingApprovals()
        });
    }

    openAddModal(): void {
        this.isEditMode = false;
        this.currentAdminId = null;
        this.adminForm = {
            fullName: '',
            email: '',
            contactNumber: '',
            password: '',
            companyName: 'Enzo Corporate',
            companyAddress: 'Main Hub',
            countryCode: '+1',
            profile: 'active'
        };
        this.showAdminModal = true;
    }

    openEditModal(admin: any): void {
        this.isEditMode = true;
        this.currentAdminId = admin.id;
        this.adminForm = {
            fullName: admin.fullName,
            email: admin.email,
            contactNumber: admin.contactNumber,
            password: '', // Password not pre-filled
            companyName: admin.companyName || 'Enzo Corporate',
            companyAddress: admin.companyAddress || 'Main Hub',
            countryCode: admin.countryCode || '+1',
            profile: admin.profile || 'active'
        };
        this.showAdminModal = true;
    }

    saveAdmin(): void {
        if (this.isEditMode && this.currentAdminId) {
            this.adminService.updateAdmin(this.currentAdminId, this.adminForm).subscribe({
                next: () => {
                    this.showAdminModal = false;
                    this.activeTab = 'admins';
                    this.loadAdmins();
                }
            });
        } else {
            this.adminService.addAdmin(this.adminForm).subscribe({
                next: () => {
                    this.showAdminModal = false;
                    this.activeTab = 'admins';
                    this.loadAdmins();
                }
            });
        }
    }

    deleteAdmin(id: number): void {
        if (confirm('Are you sure you want to delete this administrator?')) {
            this.adminService.deleteAdmin(id).subscribe({
                next: () => this.loadAdmins()
            });
        }
    }
}

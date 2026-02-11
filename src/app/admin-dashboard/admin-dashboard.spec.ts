import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AdminDashboard } from './admin-dashboard';
import { AdminService } from '../services/admin.service';
import { of } from 'rxjs';

describe('AdminDashboard', () => {
    let component: AdminDashboard;
    let fixture: ComponentFixture<AdminDashboard>;
    let adminServiceSpy: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('AdminService', [
            'getDashboardData',
            'getAdminList',
            'getAgentsList',
            'getHubsList',
            'getPendingVendors',
            'getPendingRestaurants'
        ]);

        spy.getDashboardData.and.returnValue(of({ collectionData: {} }));
        spy.getAdminList.and.returnValue(of([]));
        spy.getAgentsList.and.returnValue(of([]));
        spy.getHubsList.and.returnValue(of([]));
        spy.getPendingVendors.and.returnValue(of([]));
        spy.getPendingRestaurants.and.returnValue(of([]));

        await TestBed.configureTestingModule({
            declarations: [AdminDashboard],
            imports: [HttpClientTestingModule, FormsModule],
            providers: [
                { provide: AdminService, useValue: spy }
            ]
        }).compileComponents();

        adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
        fixture = TestBed.createComponent(AdminDashboard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

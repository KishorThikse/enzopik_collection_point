import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NearestOrderComponent } from './nearest-order';
import { OilService } from '../services/oil.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('NearestOrderComponent', () => {
    let component: NearestOrderComponent;
    let fixture: ComponentFixture<NearestOrderComponent>;
    let oilServiceSpy: jasmine.SpyObj<OilService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const oilSpy = jasmine.createSpyObj('OilService', ['getNearestOrders']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ id: 1, role: 'admin' })
        });

        oilSpy.getNearestOrders.and.returnValue(of({ success: true, data: [] }));

        await TestBed.configureTestingModule({
            declarations: [NearestOrderComponent],
            imports: [HttpClientTestingModule, FormsModule],
            providers: [
                { provide: OilService, useValue: oilSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        oilServiceSpy = TestBed.inject(OilService) as jasmine.SpyObj<OilService>;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture = TestBed.createComponent(NearestOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

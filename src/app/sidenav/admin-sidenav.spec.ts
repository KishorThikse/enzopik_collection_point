import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminSidenav } from './admin-sidenav';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AdminSidenav', () => {
    let component: AdminSidenav;
    let fixture: ComponentFixture<AdminSidenav>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let router: Router;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('AuthService', ['logout'], {
            currentUser$: of({ name: 'Admin', email: 'admin@example.com' })
        });

        await TestBed.configureTestingModule({
            declarations: [AdminSidenav],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                { provide: AuthService, useValue: spy }
            ]
        }).compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(AdminSidenav);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

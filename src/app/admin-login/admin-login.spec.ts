import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AdminLogin } from './admin-login';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AdminLogin', () => {
    let component: AdminLogin;
    let fixture: ComponentFixture<AdminLogin>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let router: Router;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('AuthService', ['login', 'logout']);

        await TestBed.configureTestingModule({
            declarations: [AdminLogin],
            imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
            providers: [
                { provide: AuthService, useValue: spy }
            ]
        }).compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(AdminLogin);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Login } from './login';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('Login', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let router: Router;

    beforeEach(async () => {
        const spy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'requestOtp', 'resetPassword']);
        spy.isAuthenticated.and.returnValue(false);

        await TestBed.configureTestingModule({
            declarations: [Login],
            imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
            providers: [
                { provide: AuthService, useValue: spy }
            ]
        }).compileComponents();

        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

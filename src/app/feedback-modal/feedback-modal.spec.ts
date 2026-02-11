import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { FeedbackModal } from './feedback-modal';
import { FeedbackService } from '../services/feedback.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('FeedbackModal', () => {
    let component: FeedbackModal;
    let fixture: ComponentFixture<FeedbackModal>;
    let feedbackServiceSpy: jasmine.SpyObj<FeedbackService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const fbSpy = jasmine.createSpyObj('FeedbackService', ['getAllFeedbacks', 'addFeedback']);
        const authSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ sub: '1', role: 'admin' })
        });

        fbSpy.getAllFeedbacks.and.returnValue(of({ status: 'success', data: [] }));

        await TestBed.configureTestingModule({
            declarations: [FeedbackModal],
            imports: [HttpClientTestingModule, FormsModule],
            providers: [
                { provide: FeedbackService, useValue: fbSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        feedbackServiceSpy = TestBed.inject(FeedbackService) as jasmine.SpyObj<FeedbackService>;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture = TestBed.createComponent(FeedbackModal);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FeedbackService, FeedbackDTO, Feedback } from '../services/feedback.service';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-feedback-modal',
    standalone: false,
    templateUrl: './feedback-modal.html',
    styleUrls: ['./feedback-modal.scss']
})
export class FeedbackModal implements OnInit {
    @Output() close = new EventEmitter<void>();

    activeTab: 'create' | 'list' = 'create';

    feedback: FeedbackDTO = {
        role: '',
        id: 1, // Default ID, backend handles it or we can fetch current user ID
        feedback: ''
    };

    feedbacks: Feedback[] = [];
    isLoading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        private feedbackService: FeedbackService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadFeedbacks();
        this.setCurrentUser();
    }

    setCurrentUser(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                // sub is often the ID, role is often the role
                this.feedback.id = user.sub ? parseInt(user.sub) : 1;
                this.feedback.role = user.role || '';
            }
        });
    }

    setTab(tab: 'create' | 'list'): void {
        this.activeTab = tab;
        if (tab === 'list') {
            this.loadFeedbacks();
        }
    }

    loadFeedbacks(): void {
        this.isLoading = true;
        this.feedbackService.getAllFeedbacks().subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    this.feedbacks = res.data;
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading feedbacks', err);
                this.isLoading = false;
            }
        });
    }

    submitFeedback(): void {
        if (!this.feedback.role || !this.feedback.feedback) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }

        this.isLoading = true;
        this.feedbackService.addFeedback(this.feedback).subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    this.successMessage = 'Feedback submitted successfully!';
                    this.feedback = { role: '', id: 1, feedback: '' };
                    setTimeout(() => {
                        this.successMessage = '';
                        this.setTab('list');
                    }, 2000);
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to submit feedback. Please try again.';
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    onClose(): void {
        this.close.emit();
    }
}

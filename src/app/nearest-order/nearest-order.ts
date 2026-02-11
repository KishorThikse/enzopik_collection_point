import { Component, OnInit } from '@angular/core';
import { OilService, NearestOrderRequest } from '../services/oil.service';
import { AuthService } from '../services/auth.service';

declare var google: any;

interface NearestOrder {
    id: number;
    status: string;
    pickup_location: string;
    distance_meters: number;
    distance_km?: string;
    latitude?: number;
    longitude?: number;
}

@Component({
    selector: 'app-nearest-order',
    standalone: false,
    templateUrl: './nearest-order.html',
    styleUrl: './nearest-order.scss'
})
export class NearestOrderComponent implements OnInit {
    orders: NearestOrder[] = [];
    isLoading: boolean = false;
    error: string | null = null;
    userRole: string = '';
    userId: number = 0;
    latitude: string = '';
    longitude: string = '';
    showManualForm: boolean = false;
    viewMode: 'table' | 'map' = 'table';

    // Google Maps properties
    private map: any = null;
    private markers: any[] = [];
    private userMarker: any = null;

    // Form data for manual entry
    manualFormData = {
        role: '',
        id: 0,
        latitude: '',
        longitude: '',
        reschedule: 'no'
    };

    constructor(
        private oilService: OilService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.userRole = user.role;
                this.userId = user.id;
                this.manualFormData.role = user.role;
                this.manualFormData.id = user.id;
                this.getCurrentLocation();
            }
        });
    }

    getCurrentLocation(): void {
        if (navigator.geolocation) {
            this.isLoading = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.latitude = position.coords.latitude.toString();
                    this.longitude = position.coords.longitude.toString();
                    this.manualFormData.latitude = this.latitude;
                    this.manualFormData.longitude = this.longitude;
                    this.loadNearestOrders();
                },
                (error) => {
                    this.isLoading = false;
                    this.error = 'Unable to retrieve your location. Please enable location services or enter coordinates manually.';
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            this.error = 'Geolocation is not supported by this browser. Please enter coordinates manually.';
        }
    }

    loadNearestOrders(): void {
        if (!this.latitude || !this.longitude || !this.userRole || !this.userId) {
            return;
        }

        const request: NearestOrderRequest = {
            role: this.userRole,
            id: this.userId,
            latitude: this.latitude,
            longitude: this.longitude,
            reschedule: 'no'
        };

        this.executeRequest(request);
    }

    submitManualRequest(): void {
        if (!this.manualFormData.latitude || !this.manualFormData.longitude || !this.manualFormData.role || !this.manualFormData.id) {
            this.error = 'Please fill in all fields.';
            return;
        }

        this.latitude = this.manualFormData.latitude;
        this.longitude = this.manualFormData.longitude;
        this.error = null;

        const request: NearestOrderRequest = {
            role: this.manualFormData.role,
            id: this.manualFormData.id,
            latitude: this.manualFormData.latitude,
            longitude: this.manualFormData.longitude,
            reschedule: this.manualFormData.reschedule
        };

        this.executeRequest(request);
    }

    private executeRequest(request: NearestOrderRequest): void {
        this.isLoading = true;
        this.oilService.getNearestOrders(request).subscribe({
            next: (response) => {
                if (response.success) {
                    this.orders = response.data.map((order: any) => ({
                        id: order.id || order.Id || order.agentId,
                        status: order.status || 'N/A',
                        pickup_location: order.pickupLocation || order.pickup_location || 'Unknown Location',
                        distance_meters: order.distance_meters || 0,
                        distance_km: ((order.distance_meters || 0) / 1000).toFixed(2),
                        // Remove the random fallback - we will use Geocoder for precision
                        latitude: order.latitude ? parseFloat(order.latitude) : undefined,
                        longitude: order.longitude ? parseFloat(order.longitude) : undefined
                    }));

                    if (this.viewMode === 'map') {
                        this.initOrUpdateMap();
                    }
                } else {
                    this.error = response.message || 'Failed to load nearest orders.';
                    this.orders = [];
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.error = 'An error occurred while fetching orders.';
                this.orders = [];
                console.error('Error fetching nearest orders:', err);
            }
        });
    }

    toggleViewMode(): void {
        this.viewMode = this.viewMode === 'table' ? 'map' : 'table';
        if (this.viewMode === 'map') {
            setTimeout(() => this.initOrUpdateMap(), 100);
        }
    }

    private initOrUpdateMap(): void {
        if (typeof google === 'undefined') {
            this.error = 'Google Maps SDK not loaded yet. Please refresh the page.';
            return;
        }

        const center = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };

        if (!this.map) {
            const mapOptions = {
                center: center,
                zoom: 13,
                styles: [
                    { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
                    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
                    { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }
                ]
            };
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        } else {
            this.map.setCenter(center);
        }

        this.clearMarkers();
        this.addUserMarker(center);
        this.addOrderMarkers();
    }

    private clearMarkers(): void {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
        if (this.userMarker) {
            this.userMarker.setMap(null);
            this.userMarker = null;
        }
    }

    private addUserMarker(position: { lat: number, lng: number }): void {
        this.userMarker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: 'Your Location',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#4f46e5',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff'
            }
        });
    }

    private addOrderMarkers(): void {
        const geocoder = new google.maps.Geocoder();

        this.orders.forEach(order => {
            // Check if we already have coordinates from a previous geocoding or from the API
            if (order.latitude && order.longitude && !isNaN(order.latitude) && !isNaN(order.longitude)) {
                this.createMarker(order);
                return;
            }

            // If coordinates are missing, geocode the pickup location address
            geocoder.geocode({ address: order.pickup_location }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                    const lat = results[0].geometry.location.lat();
                    const lng = results[0].geometry.location.lng();

                    // Update order object with exact coordinates for future use
                    order.latitude = lat;
                    order.longitude = lng;

                    this.createMarker(order);
                } else {
                    console.error(`Geocoding failed for Order #${order.id} at ${order.pickup_location}:`, status);
                }
            });
        });
    }

    private createMarker(order: NearestOrder): void {
        const marker = new google.maps.Marker({
            position: { lat: order.latitude!, lng: order.longitude! },
            map: this.map,
            title: `Order #${order.id}`,
            animation: google.maps.Animation.DROP
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: 'Rajdhani', sans-serif;">
                    <h4 style="margin: 0 0 5px 0; color: #4f46e5;">Order #${order.id}</h4>
                    <p style="margin: 0; font-size: 13px;"><b>Location:</b> ${order.pickup_location}</p>
                    <p style="margin: 3px 0; font-size: 13px;"><b>Distance:</b> ${order.distance_km} KM</p>
                    <span style="display: inline-block; margin-top: 5px; padding: 2px 8px; background: #dcfce7; color: #166534; border-radius: 4px; font-size: 11px; font-weight: 600;">${order.status}</span>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        this.markers.push(marker);
    }

    refreshLocation(): void {
        this.error = null;
        this.getCurrentLocation();
    }

    toggleManualForm(): void {
        this.showManualForm = !this.showManualForm;
        if (this.showManualForm) {
            this.manualFormData.latitude = this.latitude;
            this.manualFormData.longitude = this.longitude;
        }
    }
}

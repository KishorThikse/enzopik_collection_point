import { Component, OnInit, OnDestroy, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { RevenueService, RevenueData } from '../services/revenue.service';
import { DashboardService, DashboardSummary, OilTypeSummary, OilOrder } from '../services/dashboard.service';
import { OilService } from '../services/oil.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Define the Order interface for external use
export interface Order {
  id?: number; // Added optional id
  restaurant: string;
  oilType: string;
  quantity: string;
  amount: string;
  assignedTo: {
    name: string;
    avatar: string;
  };
  date: string;
  status: string;
  selected: boolean;
  // Extra fields for update form
  payment?: string;
  unitPrice?: string;
  paymentMethod?: string;
  agentId?: number;
  vendorId?: number;
  vendorStatus?: string;
  remarks?: string;
  reason?: string;
  oilQuality?: string;
  oilImage?: any;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {
  @Input() showOnlyTable: boolean = false;
  @Input() externalOrders: Order[] = [];

  allOrdersChecked: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  showFeedbackModal: boolean = false;
  showUpdateModal: boolean = false;
  selectedOrder: any = null;
  private destroy$ = new Subject<void>();


  // Initialize with dummy data for immediate display
  stats = {
    totalOilCollected: 0,
    totalOilCollectedChange: '0%',
    totalHubs: 0,
    totalHubsChange: '0%',
    totalFBO: 0,
    totalFBOChange: '0%',
    totalAgent: 0,
    totalAgentChange: '0%'
  };

  orders: Order[] = [];

  // Initialize with dummy donut data
  donutData: any[] = [];

  // Dummy chart data for each period
  private dummyChartData = {
    today: [],
    monthly: [],
    yearly: []
  };

  activeTab: string = 'monthly';
  private chart: Highcharts.Chart | undefined;
  private donutChart: Highcharts.Chart | undefined;
  private resizeTimeout: any;
  private isLoadingChart: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.reflowCharts();
    }, 150);
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event?: Event) {
    setTimeout(() => {
      this.reflowCharts();
    }, 200);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private revenueService: RevenueService,
    private dashboardService: DashboardService,
    private oilService: OilService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Initialize orders based on showOnlyTable flag
    if (!this.showOnlyTable) {
      this.initializeOrders();

      // Load donut chart (will be empty until API returns)
      setTimeout(() => {
        this.loadDonutChart();

        setTimeout(() => {
          this.reflowCharts();
        }, 300);
      }, 100);
    } else {
      // Use external orders if provided, otherwise use default orders
      this.orders = this.externalOrders.length > 0 ? this.externalOrders : [];
      if (this.orders.length === 0) {
        this.initializeOrders();
      }
    }

    // Try to load API data in background (will update if successful)
    this.loadDashboardSummary();
    this.loadOilSummaryData();
    this.loadChart(); // This will try API and fallback to dummy if needed
    this.loadAllOrders();
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    if (this.chart) {
      this.chart.destroy();
    }
    if (this.donutChart) {
      this.donutChart.destroy();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardSummary(): void {
    this.dashboardService.getSummaryData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          console.log('✅ Dashboard summary data received:', data);
          if (data) {
            // Mapping counts with multiple fallback names
            this.stats.totalOilCollected = data.totalOilCollected || data.total_oil_collected || data.oilCollected || data.oil_collected || 0;
            this.stats.totalHubs = data.totalHubs || data.total_hubs || data.hubs || data.totalHub || 0;
            this.stats.totalFBO = data.totalFBO || data.total_fbo || data.fbo || data.totalRestaurants || 0;
            this.stats.totalAgent = data.totalAgent || data.total_agent || data.agents || data.totalAgents || 0;

            // Mapping changes/percentages if available
            if (data.totalOilCollectedChange !== undefined || data.oil_change !== undefined) {
              this.stats.totalOilCollectedChange = data.totalOilCollectedChange || data.oil_change || '0%';
            }
            if (data.totalHubsChange !== undefined || data.hubs_change !== undefined) {
              this.stats.totalHubsChange = data.totalHubsChange || data.hubs_change || '0%';
            }
            if (data.totalFBOChange !== undefined || data.fbo_change !== undefined) {
              this.stats.totalFBOChange = data.totalFBOChange || data.fbo_change || '0%';
            }
            if (data.totalAgentChange !== undefined || data.agent_change !== undefined) {
              this.stats.totalAgentChange = data.totalAgentChange || data.agent_change || '0%';
            }

            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error loading dashboard summary:', error);
        }
      });
  }

  private loadOilSummaryData(): void {
    this.dashboardService.getOilSummaryByType()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: OilTypeSummary[]) => {
          console.log('Oil summary data received:', data);
          this.transformOilDataForDonutChart(data);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading oil summary data:', error);
        }
      });
  }

  private transformOilDataForDonutChart(apiData: any[]): void {
    if (!apiData || !Array.isArray(apiData)) {
      console.warn('⚠️ Invalid donut data received:', apiData);
      return;
    }

    // Define colors for different oil types
    const colorMap: { [key: string]: string } = {
      'Used Cooking Oil': '#3B82F6',
      'Sunflower Oil': '#F59E0B',
      'Palm Oil': '#10B981',
      'Coconut Oil': '#E5E7EB'
    };

    this.donutData = apiData.map(item => {
      const type = item.type || item.oilType || item.oil_type || 'Unknown';
      const quantity = item.totalQuantityKg || item.totalQuantity || item.quantity || item.total_quantity_kg || 0;

      return {
        label: type,
        count: typeof quantity === 'string' ? parseFloat(quantity) : quantity,
        percentage: 'KG',
        color: colorMap[type] || '#6B7280'
      };
    });

    console.log('✅ Transformed donut data:', this.donutData);

    // Reload the donut chart with new data
    if (!this.showOnlyTable) {
      setTimeout(() => {
        this.loadDonutChart();
      }, 100);
    }
  }

  private loadAllOrders(): void {
    console.log('📡 Fetching all oil orders from API...');
    this.dashboardService.getAllOilOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => {
          console.log('📥 API Response received:', data);

          if (data && Array.isArray(data)) {
            if (data.length === 0) {
              console.warn('⚠️ API returned an empty list of orders.');
              this.orders = [];
              return;
            }

            this.orders = data.map((order: any) => ({
              // ID mapping
              id: order.orderId || order.order_id || order.id,

              // Name mapping (Restaurant)
              restaurant: order.restaurantName || order.restaurant_name ||
                order.userName || order.user_name ||
                (order.userId || order.user_id ? `FBO #${order.userId || order.user_id}` : 'N/A'),

              oilType: order.type || 'N/A',

              // Quantity mapping
              quantity: (order.quantity || order.quantityKg || order.quantity_kg || '0').toString().includes('KG') ?
                (order.quantity || order.quantityKg || order.quantity_kg || '0').toString() :
                `${order.quantity || order.quantityKg || order.quantity_kg || '0'}KG`,

              // Amount mapping
              amount: (order.amount || '0').toString().includes('₹') ?
                (order.amount || '0').toString() :
                `₹${order.amount || '0'}`,

              assignedTo: {
                name: order.vendorName || order.vendor_name ||
                  (order.vendorId || order.vendor_id ? `Agent #${order.vendorId || order.vendor_id}` : 'Not Assigned'),
                avatar: `https://i.pravatar.cc/150?u=${order.vendorId || order.vendor_id || order.orderId || order.order_id || order.id || Math.random()}`
              },

              // Date mapping
              date: order.date || (order.timeline ? order.timeline.split('T')[0] : 'N/A'),

              // Status mapping
              status: order.status || 'Pending',
              selected: false,

              // Map extra fields for update modal
              payment: order.payment || null,
              unitPrice: order.proposed_unit_price || order.counter_unit_price || null,
              paymentMethod: order.payment_method || order.paymentMethod || null,
              agentId: order.agentId || order.agent_id || null,
              vendorId: order.vendorId || order.vendor_id || null, // Map vendorId correctly
              vendorStatus: order.vendorStatus || order.vendor_status || null,
              remarks: order.remarks || '',
              reason: order.reason || '',
              oilQuality: order.oilQuality || order.oil_quality || '',
              oilImage: order.oilImage || order.oil_image || null
            }));

            console.log('✅ Successfully mapped ' + this.orders.length + ' orders to table.');
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('❌ API Error in home component:', error);
          // Don't show dummy data anymore, just leave it empty if the API fails
          this.orders = [];
          this.cdr.detectChanges();
        }
      });
  }

  private initializeOrders(): void {
    this.orders = [];
  }

  private reflowCharts(): void {
    if (this.chart) {
      this.chart.reflow();
    }
    if (this.donutChart) {
      this.donutChart.reflow();
    }
  }

  setActiveTab(tab: string): void {
    console.log('🔄 Tab switching to:', tab);
    this.activeTab = tab;
    // Load API data for the selected tab
    this.loadChart();
  }

  // Load dummy chart data immediately for instant display
  private loadDummyChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const periodMap: { [key: string]: 'today' | 'monthly' | 'yearly' } = {
      'today': 'today',
      'monthly': 'monthly',
      'yearly': 'yearly'
    };

    const period = periodMap[this.activeTab] || 'monthly';
    const dummyData = this.dummyChartData[period];

    console.log('📊 Loading dummy chart data for period:', period);
    this.renderChart(dummyData);
  }

  async loadChart(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not running in browser');
      return;
    }

    if (this.isLoadingChart) {
      console.log('Chart loading already in progress, skipping...');
      return;
    }

    this.isLoadingChart = true;

    try {
      console.log('Loading chart for period:', this.activeTab);

      const periodMap: { [key: string]: 'today' | 'monthly' | 'yearly' } = {
        'today': 'today',
        'monthly': 'monthly',
        'yearly': 'yearly'
      };

      const period = periodMap[this.activeTab] || 'monthly';
      console.log('Mapped period:', period);

      this.revenueService.getRevenueByPeriod(period)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            console.log('Raw data received from API:', data);

            if (data && Array.isArray(data) && data.length > 0) {
              console.log('Data is array, rendering...');
              this.renderChart(data);
            } else if (data && typeof data === 'object' && data.labels && data.values) {
              console.log('Data has labels and values property');
              const transformedData = data.labels.map((label: string, index: number) => ({
                date: label,
                amount: data.values[index] || 0
              }));
              console.log('Transformed data:', transformedData);
              this.renderChart(transformedData);
            } else {
              console.warn('Unexpected data format:', data);
            }
          },
          error: (error) => {
            console.error('Error loading chart data:', error);
          },
          complete: () => {
            console.log('Chart data loading completed');
            this.isLoadingChart = false;
          }
        });
    } catch (error) {
      console.error('Error loading chart:', error);
      this.isLoadingChart = false;
    }
  }

  private renderChart(data: any[]): void {
    console.log('renderChart called with data:', data);

    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not in browser environment');
      return;
    }

    try {
      if (this.chart && typeof this.chart.destroy === 'function') {
        console.log('Destroying existing chart');
        this.chart.destroy();
        this.chart = undefined;
      }

      const chartElement = document.getElementById('revenueChart');
      console.log('Chart element found:', !!chartElement);

      if (!chartElement) {
        console.error('Chart container not found');
        return;
      }

      let labels: string[] = [];
      let values: number[] = [];

      if (data && data.length > 0) {
        // Try to find the label/date key
        const firstItem = data[0];
        const dateKey = ['date', 'label', 'month', 'time', 'day'].find(k => firstItem[k] !== undefined);
        const valueKey = ['amount', 'value', 'quantity', 'totalQuantity', 'totalQuantityKg', 'total_quantity_kg'].find(k => firstItem[k] !== undefined);

        if (dateKey && valueKey) {
          labels = data.map(item => item[dateKey]);
          values = data.map(item => {
            const val = item[valueKey];
            return typeof val === 'string' ? parseFloat(val) : val;
          });
        }
      }

      console.log('✅ Extracted labels:', labels);
      console.log('✅ Extracted values:', values);

      if (labels.length === 0 || values.length === 0) {
        console.warn('No valid labels or values extracted from data');
        return;
      }

      const windowWidth = window.innerWidth;
      let chartHeight = 260;

      if (windowWidth < 576) {
        chartHeight = 200;
      } else if (windowWidth < 768) {
        chartHeight = 220;
      } else if (windowWidth < 992) {
        chartHeight = 240;
      }

      chartElement.innerHTML = '';

      this.chart = Highcharts.chart('revenueChart', {
        chart: {
          type: 'area',
          backgroundColor: 'transparent',
          height: chartHeight,
          style: {
            fontFamily: 'Inter, sans-serif'
          },
          reflow: true,
          events: {
            load: function () {
              console.log('Chart loaded successfully');
              setTimeout(() => this.reflow(), 0);
            }
          }
        },
        title: { text: '' },
        credits: { enabled: false },
        xAxis: {
          categories: labels,
          labels: {
            style: { color: '#999', fontSize: '11px' }
          },
          lineColor: '#e0e0e0',
          tickColor: '#e0e0e0'
        },
        yAxis: {
          title: { text: '' },
          labels: {
            format: '{value}kg',
            style: { color: '#999', fontSize: '11px' }
          },
          gridLineColor: '#f0f0f0'
        },
        legend: { enabled: false },
        tooltip: {
          shared: true,
          valueSuffix: 'kg',
          backgroundColor: '#fff',
          borderColor: '#e0e0e0',
          borderRadius: 8,
          style: { color: '#333' }
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, 'rgba(255, 215, 0, 0.3)'],
                [1, 'rgba(255, 215, 0, 0.02)']
              ]
            },
            marker: {
              radius: 3,
              fillColor: '#FFD700',
              lineWidth: 2,
              lineColor: '#FFA500',
              states: { hover: { radius: 5 } }
            },
            lineWidth: 2,
            lineColor: '#FFD700',
            states: { hover: { lineWidth: 3 } },
            threshold: null
          }
        },
        responsive: {
          rules: [
            {
              condition: { maxWidth: 575 },
              chartOptions: {
                chart: { height: 200 },
                xAxis: { labels: { style: { fontSize: '10px' } } },
                yAxis: { labels: { style: { fontSize: '10px' } } }
              }
            },
            { condition: { minWidth: 576, maxWidth: 767 }, chartOptions: { chart: { height: 220 } } },
            { condition: { minWidth: 768, maxWidth: 991 }, chartOptions: { chart: { height: 240 } } }
          ]
        },
        series: [
          {
            type: 'area',
            name: 'Oil Collection',
            data: values,
            color: '#FFD700'
          }
        ]
      });

      setTimeout(() => this.chart?.reflow(), 100);
    } catch (error) {
      console.error('Error rendering chart:', error);
      this.chart = undefined;
    }
  }

  async loadDonutChart(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const chartElement = document.getElementById('donutChart');
      if (!chartElement) {
        console.error('Donut chart container not found');
        return;
      }

      const totalIssues = this.donutData.reduce((sum, item) => sum + item.count, 0);

      const windowWidth = window.innerWidth;
      let chartHeight = 200;

      if (windowWidth < 576) {
        chartHeight = 175;
      } else if (windowWidth < 768) {
        chartHeight = 180;
      }

      this.donutChart = Highcharts.chart('donutChart', {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent',
          height: chartHeight,
          reflow: true,
          events: {
            load: function () {
              setTimeout(() => this.reflow(), 0);
            }
          }
        },
        title: {
          text: `
            <div style="text-align: center;">
              <div style="font-size: 10px; color: #718096; font-weight: 500;">Total Oil</div>
              <div style="font-size: 24px; color: #1a202c; font-weight: 700; margin-top: 4px;">
                ${totalIssues.toLocaleString()}
              </div>
            </div>`,
          align: 'center',
          verticalAlign: 'middle',
          useHTML: true,
          y: 0
        },
        credits: { enabled: false },
        tooltip: { enabled: false },
        plotOptions: {
          pie: {
            innerSize: '70%',
            dataLabels: { enabled: false },
            states: { hover: { enabled: true, brightness: 0.1 } },
            borderWidth: 0
          }
        },
        responsive: {
          rules: [
            {
              condition: { maxWidth: 575 },
              chartOptions: {
                chart: { height: 175 },
                title: {
                  text: `
                    <div style="text-align: center;">
                      <div style="font-size: 9px; color: #718096; font-weight: 500;">Total Oil</div>
                      <div style="font-size: 20px; color: #1a202c; font-weight: 700; margin-top: 4px;">
                        ${totalIssues.toLocaleString()}
                      </div>
                    </div>`
                }
              }
            },
            { condition: { minWidth: 576, maxWidth: 767 }, chartOptions: { chart: { height: 180 } } }
          ]
        },
        series: [
          {
            type: 'pie',
            name: 'Oil Types',
            data: this.donutData.map(item => ({
              name: item.label,
              y: item.count,
              color: item.color
            }))
          }
        ]
      });

      setTimeout(() => this.donutChart?.reflow(), 100);
    } catch (error) {
      console.error('Error loading donut chart:', error);
    }
  }

  toggleAllOrderCheckboxes(event: any): void {
    const checked = event.target.checked;
    this.allOrdersChecked = checked;
    this.orders.forEach(order => {
      order.selected = checked;
    });
  }

  onOrderCheckboxChange(): void {
    this.allOrdersChecked = this.orders.every(order => order.selected);
  }

  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.orders.length / this.pageSize) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getStatusClass(status: string): string {
    if (!status) return 'pending';
    const s = status.toLowerCase();

    // Exact matches
    if (['assigned', 'pending', 'completed', 'cancelled'].includes(s)) {
      return s;
    }

    // Grouped matches for more statuses
    if (s.includes('accepted') || s.includes('approved') || s.includes('confirmed') || s.includes('acknowledged') || s.includes('assigned')) {
      return 'assigned'; // Green style
    }

    if (s.includes('reject') || s.includes('fail') || s.includes('stop') || s.includes('cancel')) {
      return 'cancelled'; // Red style
    }

    if (s.includes('progress') || s.includes('process') || s.includes('wait') || s.includes('complete')) {
      return 'completed'; // Blue style
    }

    return 'pending'; // Default yellow style
  }

  // --- Update Order Logic ---

  openUpdateModal(order: Order): void {
    const orderId = order.id;

    if (!orderId) {
      console.error('Order ID not found');
      return;
    }

    console.log('Opening update modal for order (using list data):', order);

    // Use data directly from the order object (fetched by loadAllOrders)
    this.selectedOrder = {
      id: orderId,
      status: order.status || '',
      payment: order.payment || 'pending',
      unitPrice: order.unitPrice || '',
      amount: typeof order.amount === 'string' ? order.amount.replace('₹', '') : order.amount,
      paymentMethod: order.paymentMethod || '',
      agentId: order.agentId || null,
      vendorId: order.vendorId || null,
      vendorStatus: order.vendorStatus || '',
      remarks: order.remarks || '',
      reason: order.reason || '',
      oilQuality: order.oilQuality || '',
      timeline: order.date ? order.date.split('T')[0] : '', // Use date from table
      quantity: typeof order.quantity === 'string' ? order.quantity.replace('KG', '') : order.quantity,
      oilImage: null // Always reset file input on open
    };

    this.showUpdateModal = true;
    this.cdr.detectChanges();
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedOrder = null;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && this.selectedOrder) {
      this.selectedOrder.oilImage = file;
    }
  }

  onUpdateFormSubmit(formData: any): void {
    if (!this.selectedOrder || !this.selectedOrder.id) {
      console.error('No order selected for update');
      return;
    }

    const updateFormData = new FormData();

    // Append fields only if they have values
    if (formData.status) updateFormData.append('Status', formData.status);
    if (formData.payment) updateFormData.append('Payment', formData.payment);
    if (formData.unitPrice) updateFormData.append('UnitPrice', formData.unitPrice.toString());
    if (formData.amount) updateFormData.append('Amount', formData.amount.toString());
    if (formData.paymentMethod) updateFormData.append('PaymentMethod', formData.paymentMethod);
    if (formData.agentId) updateFormData.append('AgentId', formData.agentId.toString());
    if (formData.vendorId) updateFormData.append('VendorId', formData.vendorId.toString());
    if (formData.vendorStatus) updateFormData.append('VendorStatus', formData.vendorStatus);
    if (formData.remarks) updateFormData.append('Remarks', formData.remarks);
    if (formData.reason) updateFormData.append('Reason', formData.reason);
    if (formData.oilQuality) updateFormData.append('OilQuality', formData.oilQuality);
    if (formData.timeline) updateFormData.append('Timeline', formData.timeline);
    if (formData.quantity) updateFormData.append('Quantity', formData.quantity.toString());

    // File upload
    if (this.selectedOrder.oilImage) {
      updateFormData.append('OilImage', this.selectedOrder.oilImage);
    }

    console.log(`Submitting update for Order #${this.selectedOrder.id}`);

    this.oilService.updateOilOrder(this.selectedOrder.id, updateFormData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Order updated successfully:', response);
          alert('Order updated successfully!');
          this.closeUpdateModal();
          this.loadAllOrders(); // Refresh list
        },
        error: (error) => {
          console.error('Error updating order:', error);
          alert('Failed to update order. Please try again.');
        }
      });
  }
}
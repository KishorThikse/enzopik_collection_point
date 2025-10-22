import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as Highcharts from 'highcharts';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { RevenueService, RevenueData } from '../services/revenue.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {

  allOrdersChecked: boolean = false;
  private destroy$ = new Subject<void>();

  stats = {
    totalApplied: 3540,
    totalAppliedChange: '+25.5%',
    shortlisted: 1150,
    shortlistedChange: '+4.10%',
    holded: 500,
    holdedChange: '+4.13%',
    rejected: 850,
    rejectedChange: '+4.13%'
  };

  orders = [
    {
      restaurant: 'Le Royal Park',
      oilType: 'Sunflower oil',
      quantity: '40KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Wade Warren',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      date: '12/06/2020',
      status: 'Assigned',
      selected: false
    },
    {
      restaurant: 'Akantega Ltd.',
      oilType: 'Used cooking oil',
      quantity: '703KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Annette Black',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      date: '03/01/2020',
      status: 'Pending',
      selected: false
    },
    {
      restaurant: 'Binford Ltd.',
      oilType: 'Used cooking oil',
      quantity: '994KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Jane Cooper',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      date: '19/07/2020',
      status: 'Pending',
      selected: false
    },
    {
      restaurant: 'Acme Co.',
      oilType: 'Used cooking oil',
      quantity: '429KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Theresa Webb',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      date: '11/07/2020',
      status: 'Pending',
      selected: false
    },
    {
      restaurant: 'Biffco Enterprises Ltd.',
      oilType: 'Used cooking oil',
      quantity: '177KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Ralph Edwards',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      date: '27/02/2020',
      status: 'Pending',
      selected: false
    },
    {
      restaurant: 'Big Kahuna Burger Ltd.',
      oilType: 'Used cooking oil',
      quantity: '819KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Bessie Cooper',
        avatar: 'https://i.pravatar.cc/150?img=6'
      },
      date: '26/04/2020',
      status: 'Pending',
      selected: false
    },
    {
      restaurant: 'Barone LLC.',
      oilType: 'Used cooking oil',
      quantity: '740KG',
      amount: '₹2000',
      assignedTo: {
        name: 'Marvin McKinney',
        avatar: 'https://i.pravatar.cc/150?img=7'
      },
      date: '30/04/2020',
      status: 'Pending',
      selected: false
    }
  ];

  donutData = [
    {
      label: 'Used Cooking Oil',
      count: 834,
      percentage: 'KG',
      color: '#3B82F6'
    },
    {
      label: 'Palm Oil',
      count: 2890,
      percentage: 'KG',
      color: '#F59E0B'
    },
    {
      label: 'Completed',
      count: 3478,
      percentage: 'KG',
      color: '#10B981'
    },
    {
      label: 'Sunflower Oil',
      count: 826,
      percentage: 'KG',
      color: '#E5E7EB'
    }
  ];

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
    private revenueService: RevenueService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadChart();
      this.loadDonutChart();

      setTimeout(() => {
        this.reflowCharts();
      }, 300);
    }, 100);
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

  private reflowCharts(): void {
    if (this.chart) {
      this.chart.reflow();
    }
    if (this.donutChart) {
      this.donutChart.reflow();
    }
  }

  setActiveTab(tab: string): void {
    console.log('🔄 Tab switching from:', this.activeTab, 'to:', tab);
    this.activeTab = tab;
    this.loadChart();
  }

  async loadChart(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not running in browser');
      return;
    }

    // Prevent multiple simultaneous API calls
    if (this.isLoadingChart) {
      console.log('Chart loading already in progress, skipping...');
      return;
    }

    this.isLoadingChart = true;

    try {
      console.log('Loading chart for period:', this.activeTab);
      
      // Map frontend tab to service period parameter
      const periodMap: { [key: string]: 'today' | 'monthly' | 'yearly' } = {
        'today': 'today',
        'monthly': 'monthly',
        'yearly': 'yearly'
      };

      const period = periodMap[this.activeTab] || 'monthly';
      console.log('Mapped period:', period);

      // Call the service
      this.revenueService.getRevenueByPeriod(period)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            console.log('Raw data received from API:', data);
            console.log('Data type:', typeof data);
            console.log('Is array?:', Array.isArray(data));
            console.log('Data keys:', Object.keys(data || {}));
            
            // Check if data is in the expected format
            if (data && Array.isArray(data) && data.length > 0) {
              console.log('Data is array, rendering...');
              this.renderChart(data);
            } else if (data && typeof data === 'object' && data.labels && data.values) {
              // Backend might be returning { labels: [], values: [] } format
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
            console.error('Error status:', error?.status);
            console.error('Error message:', error?.message);
            console.error('Full error object:', error);
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
      // Destroy existing chart if it exists and is valid
      if (this.chart && typeof this.chart.destroy === 'function') {
        console.log('Destroying existing chart');
        this.chart.destroy();
        this.chart = undefined;
      }

      const chartElement = document.getElementById('revenueChart');
      console.log('Chart element found:', !!chartElement);

      if (!chartElement) {
        console.error('Chart container not found - make sure id="revenueChart" exists in HTML');
        return;
      }

      // Extract labels and values from data
      let labels: string[] = [];
      let values: number[] = [];

      if (data && data.length > 0) {
        if (data[0].date !== undefined) {
          // Data format: { date: "Jul", amount: 1210 }
          labels = data.map(item => item.date);
          values = data.map(item => typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount);
        } else if (data[0].label !== undefined) {
          // Alternative data format: { label: "Jul", value: 1210 }
          labels = data.map(item => item.label);
          values = data.map(item => typeof item.value === 'string' ? parseFloat(item.value) : item.value);
        }
      }
      
      console.log('Extracted labels:', labels);
      console.log('Extracted values:', values);

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

      console.log('Creating chart with height:', chartHeight);

      // Clear any existing content in the chart container
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
            load: function() {
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

      console.log('✅ Chart created and rendered successfully');
      setTimeout(() => this.chart?.reflow(), 100);
    } catch (error) {
      console.error('Error rendering chart:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : '');
      // Reset chart reference on error
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
            load: function() {
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
}
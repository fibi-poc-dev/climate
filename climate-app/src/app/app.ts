import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ClimateDataService } from './services/climate-data.service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'דוחות ESG ואקלים';

  protected activeTab = signal(0);

  protected tabs = [
    { id: 0, label: 'דוח ESG ראשי', route: '/esg' },
    { id: 1, label: 'טביעת רגל פחמנית', route: '/carbon-footprint' },
    { id: 2, label: 'אשראי ירוק חדש', route: '/green-credit' },
    { id: 3, label: 'ESG Prime', route: '/esg-prime' },
    { id: 4, label: 'מגבלות', route: '/limitations' },
    { id: 5, label: 'שאלוני סיכון שיורי', route: '/risk-questionnaires' }
  ];

  private router = inject(Router);
  private climateDataService = inject(ClimateDataService);

  ngOnInit(): void {
    // Initialize climate data when the app starts
    this.initializeData();

    // Set initial active tab based on current route
    this.updateActiveTabFromRoute(this.router.url);

    // Listen to route changes to update active tab
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActiveTabFromRoute(event.url);
      });
  }

  protected selectTab(tabId: number): void {
    this.activeTab.set(tabId);
    const selectedTab = this.tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      this.router.navigate([selectedTab.route]);
    }
  }

  private updateActiveTabFromRoute(url: string): void {
    const matchingTab = this.tabs.find(tab => url.startsWith(tab.route));
    if (matchingTab) {
      this.activeTab.set(matchingTab.id);
    }
  }

  private initializeData(): void {
    // Load climate data on app initialization
    // This ensures data is available for all tabs without additional HTTP calls
    this.climateDataService.loadClimateData().subscribe({
      next: () => {
        console.log('Climate data loaded successfully');
      },
      error: (error) => {
        console.error('Failed to load climate data on app initialization:', error);
      }
    });
  }
}

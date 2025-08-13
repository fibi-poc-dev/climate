import { Component, computed, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClimateDataService } from '../../services/climate-data.service';
import { NewGreenCreditRow } from '../../models/new-green-credit.model';


@Component({
    selector: 'app-green-credit',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './green-credit.component.html',
    styleUrl: './green-credit.component.css'
})
export class GreenCreditComponent implements OnInit, OnDestroy {
    private readonly climateDataService = inject(ClimateDataService);

    // Loading and error states
    protected readonly isLoading = computed(() => this.climateDataService.loading());
    protected readonly error = computed(() => this.climateDataService.error());

    // New Green Credit data
    protected readonly newGreenCreditData = computed(() =>
        this.climateDataService.newGreenCreditData()?.newGreenCreditReport?.newGreenCreditReportRows || []
    );

    protected readonly hasData = computed(() => this.newGreenCreditData().length > 0);

    // Filter signals
    protected readonly searchTerm = signal('');
    protected readonly selectedCluster = signal<number | null>(null);
    protected readonly selectedBranch = signal<number | null>(null);
    protected readonly sortField = signal<keyof NewGreenCreditRow | null>(null);
    protected readonly sortDirection = signal<'asc' | 'desc'>('asc');

    // Scroll tracking
    protected readonly scrollProgress = signal(0);
    protected readonly showScrollToTop = signal(false);
    private scrollListener?: () => void;

    // Computed data for display
    protected readonly filteredData = computed(() => {
        let data = this.newGreenCreditData();

        // Apply search filter
        const search = this.searchTerm().toLowerCase();
        if (search) {
            data = data.filter(row =>
                row.accountName.toLowerCase().includes(search) ||
                row.branchClassificatonDescription.toLowerCase().includes(search) ||
                row.displayReason.toLowerCase().includes(search) ||
                row.greenClusterDescription?.toLowerCase().includes(search) ||
                row.account.toString().includes(search)
            );
        }

        // Apply cluster filter
        const cluster = this.selectedCluster();
        if (cluster !== null) {
            data = data.filter(row => row.greenCluster === cluster);
        }

        // Apply branch filter
        const branch = this.selectedBranch();
        if (branch !== null) {
            data = data.filter(row => row.branch === branch);
        }

        // Apply sorting
        const field = this.sortField();
        if (field) {
            const direction = this.sortDirection();
            data = [...data].sort((a, b) => {
                const aValue = a[field];
                const bValue = b[field];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                let comparison = 0;
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue, 'he');
                } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(String(bValue), 'he');
                }

                return direction === 'asc' ? comparison : -comparison;
            });
        }

        return data;
    });

    // Statistics computed values
    protected readonly totalAccounts = computed(() => this.filteredData().length);
    protected readonly totalBalanceSheetRisk = computed(() =>
        this.filteredData().reduce((sum, row) => sum + (row.creditBalanceSheetRisk || 0), 0)
    );
    protected readonly totalOffBalanceSheetRisk = computed(() =>
        this.filteredData().reduce((sum, row) => sum + (row.creditOffBalanceSheetRisk || 0), 0)
    );
    protected readonly totalBalance = computed(() =>
        this.filteredData().reduce((sum, row) => sum + (row.totalBalanceSheet || 0), 0)
    );

    // Unique values for filters
    protected readonly uniqueClusters = computed(() => {
        const clusters = this.newGreenCreditData()
            .map(row => ({ id: row.greenCluster, desc: row.greenClusterDescription }))
            .filter(cluster => cluster.id !== null);
        const unique = clusters.reduce((acc, cluster) => {
            if (!acc.some(c => c.id === cluster.id)) {
                acc.push(cluster);
            }
            return acc;
        }, [] as { id: number | null; desc: string | null }[]);
        return unique.sort((a, b) => (a.desc || '').localeCompare(b.desc || '', 'he'));
    });

    protected readonly uniqueBranches = computed(() => {
        const branches = [...new Set(this.newGreenCreditData().map(row => row.branch))];
        return branches.sort((a, b) => a - b);
    });

    ngOnInit(): void {
        // Load data if not already loaded
        this.climateDataService.loadClimateData().subscribe();

        // Set up scroll listener
        this.setupScrollListener();
    }

    ngOnDestroy(): void {
        // Clean up scroll listener
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
        }
    }

    private setupScrollListener(): void {
        this.scrollListener = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

            this.scrollProgress.set(progress);
            this.showScrollToTop.set(scrollTop > 300);
        };

        window.addEventListener('scroll', this.scrollListener, { passive: true });
    }

    // Filter methods
    protected onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchTerm.set(input.value);
    }

    protected onClusterChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const value = select.value === 'null' ? null : Number(select.value);
        this.selectedCluster.set(value);
    }

    protected onBranchChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const value = select.value === 'null' ? null : Number(select.value);
        this.selectedBranch.set(value);
    }

    protected clearFilters(): void {
        this.searchTerm.set('');
        this.selectedCluster.set(null);
        this.selectedBranch.set(null);
        this.sortField.set(null);
        this.sortDirection.set('asc');
    }

    // Sorting methods
    protected sort(field: keyof NewGreenCreditRow): void {
        if (this.sortField() === field) {
            this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
        } else {
            this.sortField.set(field);
            this.sortDirection.set('asc');
        }
    }

    protected getSortIcon(field: keyof NewGreenCreditRow): string {
        if (this.sortField() !== field) return '↕';
        return this.sortDirection() === 'asc' ? '↑' : '↓';
    }

    // Utility methods
    protected formatNumber(value: number | null): string {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('he-IL').format(value);
    }

    protected formatDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('he-IL');
        } catch {
            return dateString;
        }
    }

    protected getClimateColorClass(climateColor: number): string {
        switch (climateColor) {
            case 1: return 'climate-color-green';
            case 2: return 'climate-color-yellow';
            case 3: return 'climate-color-red';
            default: return '';
        }
    }

    // Export functionality
    protected exportToCSV(): void {
        const data = this.filteredData();
        if (data.length === 0) return;

        const headers = [
            'תאריך נכונות נתונים',
            'בנק',
            'סניף',
            'חשבון',
            'שם חשבון',
            'תיאור ענף',
            'תאריך מתן',
            'סיבת תצוגה',
            'צבע אקלים',
            'תיאור אשכול ירוק',
            'יתרת סיכון מאזני',
            'יתרת סיכון חוץ מאזני',
            'סה"כ מאזן'
        ];

        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                this.formatDate(row.dataCorrectnessDate),
                row.bank,
                row.branch,
                row.account,
                `"${row.accountName}"`,
                `"${row.branchClassificatonDescription}"`,
                this.formatDate(row.originationDate),
                `"${row.displayReason}"`,
                `"${row.climateColorDescription}"`,
                `"${row.greenClusterDescription || ''}"`,
                row.creditBalanceSheetRisk,
                row.creditOffBalanceSheetRisk,
                row.totalBalanceSheet
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `green-credit-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Scroll methods
    protected scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    protected getScrollProgress(): number {
        return this.scrollProgress();
    }

    protected isScrollToTopVisible(): boolean {
        return this.showScrollToTop();
    }
}

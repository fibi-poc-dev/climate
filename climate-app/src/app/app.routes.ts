import { Routes } from '@angular/router';
import { MainReportComponent } from './components/main-report/main-report.component';
import { CarbonFootprintComponent } from './components/carbon-footprint/carbon-footprint.component';
import { GreenCreditComponent } from './components/green-credit/green-credit.component';
import { EsgPrimeComponent } from './components/esg-prime/esg-prime.component';

export const routes: Routes = [
  { path: '', redirectTo: '/esg', pathMatch: 'full' },
  { path: 'esg', component: MainReportComponent },
  { path: 'carbon-footprint', component: CarbonFootprintComponent },
  { path: 'green-credit', component: GreenCreditComponent },
  { path: 'esg-prime', component: EsgPrimeComponent },
  { path: 'limitations', component: MainReportComponent }, // Placeholder - will be replaced with dedicated component
  { path: 'risk-questionnaires', component: MainReportComponent }, // Placeholder - will be replaced with dedicated component
  { path: '**', redirectTo: '/esg' }
];

import { Routes } from '@angular/router';
import { MainReportComponent } from './components/main-report/main-report.component';

export const routes: Routes = [
  { path: '', redirectTo: '/esg', pathMatch: 'full' },
  { path: 'esg', component: MainReportComponent },
  { path: 'carbon-footprint', component: MainReportComponent }, // Placeholder - will be replaced with dedicated component
  { path: 'green-credit', component: MainReportComponent }, // Placeholder - will be replaced with dedicated component
  { path: 'limitations', component: MainReportComponent }, // Placeholder - will be replaced with dedicated component
  { path: 'risk-questionnaires', component: MainReportComponent }, // Placeholder - will be replaced with dedicated component
  { path: '**', redirectTo: '/esg' }
];

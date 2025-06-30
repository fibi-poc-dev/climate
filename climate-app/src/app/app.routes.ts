import { Routes } from '@angular/router';
import { MainReportComponent } from './components/main-report/main-report.component';

export const routes: Routes = [
  { path: '', component: MainReportComponent },
  { path: '**', redirectTo: '' }
];

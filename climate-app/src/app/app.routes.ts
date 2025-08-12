import { Routes } from '@angular/router';
import { CarbonFootprintComponent } from './components/carbon-footprint/carbon-footprint.component';
import { GreenCreditComponent } from './components/green-credit/green-credit.component';
import { EsgComponent } from './components/esg/esg.component';

export const routes: Routes = [
  { path: '', redirectTo: '/esg', pathMatch: 'full' },
  { path: 'esg', component: EsgComponent },
  { path: 'carbon-footprint', component: CarbonFootprintComponent },
  { path: 'green-credit', component: GreenCreditComponent },
  { path: 'esg-prime', component: EsgComponent },
  { path: 'limitations', component: EsgComponent }, // Placeholder - will be replaced with dedicated component
  { path: 'risk-questionnaires', component: EsgComponent }, // Placeholder - will be replaced with dedicated component
  { path: '**', redirectTo: '/esg' }
];

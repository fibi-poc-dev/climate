import { Routes } from '@angular/router';
import { CarbonFootprintComponent } from './components/carbon-footprint/carbon-footprint.component';
import { GreenCreditComponent } from './components/green-credit/green-credit.component';
import { EsgPrimeComponent } from './components/esg-prime/esg-prime.component';

export const routes: Routes = [
  { path: '', redirectTo: '/esg', pathMatch: 'full' },
  { path: 'esg', component: EsgPrimeComponent },
  { path: 'carbon-footprint', component: CarbonFootprintComponent },
  { path: 'green-credit', component: GreenCreditComponent },
  { path: 'esg-prime', component: EsgPrimeComponent },
  { path: 'limitations', component: EsgPrimeComponent }, // Placeholder - will be replaced with dedicated component
  { path: 'risk-questionnaires', component: EsgPrimeComponent }, // Placeholder - will be replaced with dedicated component
  { path: '**', redirectTo: '/esg' }
];

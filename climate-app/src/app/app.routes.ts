import { Routes } from '@angular/router';
import { CarbonFootprintComponent } from './components/carbon-footprint/carbon-footprint.component';
import { GreenCreditComponent } from './components/green-credit/green-credit.component';
import { EsgComponent } from './components/esg/esg.component';
import { LimitationsComponent } from './components/limitations/limitations.component';
import { RiskComponent } from './components/risk/risk.component';

export const routes: Routes = [
  { path: '', redirectTo: '/esg', pathMatch: 'full' },
  { path: 'esg', component: EsgComponent },
  { path: 'carbon-footprint', component: CarbonFootprintComponent },
  { path: 'green-credit', component: GreenCreditComponent },
  { path: 'limitations', component: LimitationsComponent }, 
  { path: 'risk', component: RiskComponent },
  { path: '**', redirectTo: '/esg' }
];

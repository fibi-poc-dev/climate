import { Component } from '@angular/core';
import { MainReportComponent } from './components/main-report/main-report.component';

@Component({
  selector: 'app-root',
  imports: [MainReportComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'climate-app';
}

import { Component } from '@angular/core';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Table';
}

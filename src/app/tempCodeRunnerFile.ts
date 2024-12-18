import { RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatTableModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Table';
  displayedColumns: string[] = [
    'id',
    'fullName',
    'contactNumber',
    'email',
    'joinDate',
    'lastUpdatedDate',
    'Action',
  ];

  // Initial data source
  dataSource = ELEMENT_DATA;

  ngOnInit() {
    // Load saved data from localStorage, if available
    const savedData: PeriodicElement[] = JSON.parse(localStorage.getItem('EmpData') || '[]');
    if (savedData.length > 0) {
      this.dataSource = savedData; // Replace with saved data if exists
      console.log('Loaded data from localStorage:', this.dataSource);
    }else {
      this.dataSource = ELEMENT_DATA; // Use default data if no saved data exists
      console.log('Using default data:', this.dataSource);
    }
    // console.log('Data source:', this.dataSource);
  }

  // Save data for a specific row
  onSave(id: number) {
    // Load saved data from localStorage before saving
    let savedData: PeriodicElement[] = JSON.parse(localStorage.getItem('EmpData') || '[]');
    
    // Find the row data by id
    const rowData = this.dataSource.find(item => item.id === id);
    
    if (rowData) {
      // console.log('Row data saved:', rowData);
      // Check if the data is already saved, then update it
      const index = savedData.findIndex(item => item.id === id);
      if (index !== -1) {
        savedData[index] = rowData; // Update the existing item
      } else {
        savedData.push(rowData); // Add new item
      }

      // Save the updated data back to localStorage
      localStorage.setItem('EmpData', JSON.stringify(savedData));
      // console.log('Row data saved:', rowData);
      console.log('Data source:', this.dataSource); 
      this.dataSource = [...savedData];  // Ensures the table updates
      // } else {
      //   console.error(`Row with id: ${id} not found`);
      // }
    }
  }
  onCancel() {
    console.log('Operation cancelled');
  }

}
export interface PeriodicElement {
  id: number;
  fullName: string;
  contactNumber: number;
  email: string;
  joinDate: string;
  lastUpdatedDate: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    fullName:'jay suthar',
    contactNumber: 123456,
    email: 'jay@gmail.com',
    joinDate: '14 Dec 2020',
    lastUpdatedDate: '16 Mar 2023',
  },
  {
    id: 2,
    fullName: 'ajay patel',
    contactNumber: 123456,
    email: 'ajay@gmail.com',
    joinDate: '10 Feb 2014',
    lastUpdatedDate: '1 Jul 2024',
  },
  {
    id: 3,
    fullName: 'om panchal',
    contactNumber: 123456,
    email: 'om@gmail.com',
    joinDate: '5 Jan 2015',
    lastUpdatedDate: '16 Apr 2018',
  },
  {
    id: 4,
    fullName: 'abhay solanki',
    contactNumber: 123456,
    email: 'abhay@gmail.com',
    joinDate: '1 Jun 2018',
    lastUpdatedDate: '20 Sep 2021',
  },
];

import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef } from '@angular/core';
import { UserData } from '../models/user-data.model';
import { SaveConfirmationDialogComponent } from '../save-confirmation-dialog/save-confirmation-dialog.component';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
})
export class EmployeeTableComponent implements OnInit {
  title = 'Employee Data';
  displayedColumns: string[] = [
    'id',
    'fullName',
    'contactNumber',
    'email',
    'joinDate',
    'lastUpdatedDate',
    'action',
  ];
  dataSource: UserData[] = [];

  // Inject MatDialog service to open dialog
  private dialog = inject(MatDialog); // This Is Modern Approach
  //both are working same
  // constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {} --> Traditional Approach
  // constructor(private cdr: ChangeDetectorRef) { } --> Traditional Approach
  private cdr = inject(ChangeDetectorRef); // This Is Modern Approach
  ngOnInit() {
    const savedData: UserData[] = JSON.parse(
      localStorage.getItem('EmpData') || '[]'
    );
    if (savedData.length > 0) {
      console.log('Loaded saved data from localStorage:', savedData);
      this.dataSource = savedData;
    } else {
      console.log('Using default USER_DATA');
      this.dataSource = USER_DATA;
    }
  }

  onSave(currentId: number) {
    const matchedRow = this.dataSource.find((d) => d.id === currentId);
    if (matchedRow) {
      console.log('Opening dialog with rowData:', matchedRow);
      const dialogRef = this.dialog.open(SaveConfirmationDialogComponent, {
        data: { ...matchedRow },
      });

      dialogRef.afterClosed().subscribe((updatedRow) => {
        if (updatedRow) {
          this.saveRowData(updatedRow); // Save the updated data if not canceled
        } else {
          console.log('Save operation cancelled');
        }
      });
    }
  }

  // Refresh data after an operation
  refreshData() {
    this.dataSource = JSON.parse(localStorage.getItem('EmpData') || '[]');
    this.cdr.detectChanges();
  }

  // Save the updated row data
  saveRowData(row: UserData) {
    const index = this.dataSource.findIndex((item) => item.id === row.id);
    if (index !== -1) {
      this.dataSource[index] = { ...row }; // Update the specific row
    }

    // Save the entire dataSource to localStorage
    localStorage.setItem('EmpData', JSON.stringify(this.dataSource));
    console.log('Updated dataSource:', this.dataSource);
    console.log('Saved data to localStorage:', localStorage.getItem('EmpData'));

    // Trigger change detection to update the view
    this.refreshData();
  }

  onCancel() {
    console.log('Operation cancelled');
  }
}

const USER_DATA: UserData[] = [
  {
    id: 1,
    fullName: 'Jay Suthar',
    contactNumber: 123456,
    email: 'jay@gmail.com',
    joinDate: '2020-10-14',
    lastUpdatedDate: '2023-03-16',
  },
  {
    id: 2,
    fullName: 'Ajay Patel',
    contactNumber: 123456,
    email: 'ajay@gmail.com',
    joinDate: '2014-02-10',
    lastUpdatedDate: '2024-07-01',
  },
  {
    id: 3,
    fullName: 'Om Panchal',
    contactNumber: 123456,
    email: 'om@gmail.com',
    joinDate: '2015-01-05',
    lastUpdatedDate: '2018-04-16',
  },
  {
    id: 4,
    fullName: 'Abhay Solanki',
    contactNumber: 123456,
    email: 'abhay@gmail.com',
    joinDate: '2018-10-01',
    lastUpdatedDate: '2021-09-20',
  },
];

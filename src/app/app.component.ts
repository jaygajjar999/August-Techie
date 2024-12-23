import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
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
    'action',
  ];

  dataSource: UserData[] = [];
  dialog = inject(MatDialog);

  constructor(private cdr: ChangeDetectorRef) {}

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

    console.log('dataSource:', this.dataSource);
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
          this.saveRowData(updatedRow);
        } else {
          console.log('Save operation cancelled');
        }
      });
    }
  }
  refreshData() {
    this.dataSource = JSON.parse(localStorage.getItem('EmpData') || '[]');
    this.cdr.detectChanges();
  }

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
    // this.cdr.detectChanges();
    // Reload the page to reflect changes this is optonal method also work
    // window.location.reload();
    this.refreshData();
  }

  onCancel() {
    console.log('Operation cancelled');
  }
}

@Component({
  selector: 'app-save-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div mat-dialog-content class="px-6 py-4 bg-white rounded-lg shadow">
  <h1
    mat-dialog-title
    class="relative text-2xl font-bold text-white text-center my-2 py-4 px-6 rounded-lg shadow-md bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"
  >
    Confirm Save
  </h1>
  <strong class="block mb-4 text-gray-700">
    Are you sure you want to save this data?
  </strong>

  <div *ngIf="rowData" class="space-y-4">
    <p>
      <label for="fullName" class="block text-gray-700 font-medium">Full Name:</label>
      <input
        id="fullName"
        type="text"
        [(ngModel)]="rowData.fullName"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </p>
    <p>
      <label for="contactNumber" class="block text-gray-700 font-medium">Contact Number:</label>
      <input
        id="contactNumber"
        type="text"
        [(ngModel)]="rowData.contactNumber"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </p>
    <p>
      <label for="email" class="block text-gray-700 font-medium">Email:</label>
      <input
        id="email"
        type="email"
        [(ngModel)]="rowData.email"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </p>
    <p>
      <label for="joinDate" class="block text-gray-700 font-medium">Join Date:</label>
      <input
        id="joinDate"
        type="date"
        [(ngModel)]="rowData.joinDate"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </p>
    <p>
      <label for="lastUpdatedDate" class="block text-gray-700 font-medium">Last Updated Date:</label>
      <input
        id="lastUpdatedDate"
        type="date"
        [(ngModel)]="rowData.lastUpdatedDate"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </p>
  </div>
</div>

<div mat-dialog-actions class="px-6 py-4 flex justify-center space-x-4">
  <button
    mat-button
    (click)="onCancel()"
    class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
  >
    Cancel
  </button>
  <button
    mat-button
    color="primary"
    (click)="onConfirm()"
    class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
  >
    Save
  </button>
</div>

  `,
})
export class SaveConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaveConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData: UserData
  ) {
    console.log('Row Data inside Dialog:', this.rowData);
  }

  onConfirm() {
    this.dialogRef.close(this.rowData);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}

export interface UserData {
  id: number;
  fullName: string;
  contactNumber: number;
  email: string;
  joinDate: string;
  lastUpdatedDate: string;
}

const USER_DATA: UserData[] = [
  {
    id: 1,
    fullName: 'jay suthar',
    contactNumber: 123456,
    email: 'jay@gmail.com',
    joinDate: '2020-10-14',
    lastUpdatedDate: '2023-03-16',
  },
  {
    id: 2,
    fullName: 'ajay patel',
    contactNumber: 123456,
    email: 'ajay@gmail.com',
    joinDate: '2014-02-10',
    lastUpdatedDate: '2024-07-01',
  },
  {
    id: 3,
    fullName: 'om panchal',
    contactNumber: 123456,
    email: 'om@gmail.com',
    joinDate: '2015-01-05',
    lastUpdatedDate: '2018-04-16',
  },
  {
    id: 4,
    fullName: 'abhay solanki',
    contactNumber: 123456,
    email: 'abhay@gmail.com',
    joinDate: '2018-10-01',
    lastUpdatedDate: '2021-09-20',
  },
];

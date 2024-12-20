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
    const savedData: UserData[] = JSON.parse(localStorage.getItem('EmpData') || '[]');

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
     // Reload the page to reflect changes
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
    <h1 mat-dialog-title class="dialog-header">Confirm Save</h1>
    <div mat-dialog-content class="dialog-content">
      <strong>Are you sure you want to save this Data?</strong>
      <div *ngIf="rowData" class="dialog-form-container">
        <p>
          <strong>Full Name:</strong>
          <input type="text" [(ngModel)]="rowData.fullName" />
        </p>
        <p>
          <strong>Contact Number:</strong>
          <input type="text" [(ngModel)]="rowData.contactNumber" />
        </p>
        <p>
          <strong>Email:</strong>
          <input type="email" [(ngModel)]="rowData.email" />
        </p>
        <p>
          <strong>Join Date:</strong>
          <input type="date" [(ngModel)]="rowData.joinDate" />
        </p>
        <p>
          <strong>Last Updated Date:</strong>
          <input type="date" [(ngModel)]="rowData.lastUpdatedDate" />
        </p>
      </div>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()" class="dialog-button-cancel">Cancel</button>
      <button mat-button color="primary" (click) ="onConfirm()" class="dialog-button-save">Save</button>
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

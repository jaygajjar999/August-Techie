
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { SharedModule } from './shared/shared.module'; 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, FormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Table';
  displayedColumns: string[] = ['id', 'Fullname', 'Contactnumber', 'Email', 'Join_Date', 'Last_updated_Date', 'Action'];
  dataSource = ELEMENT_DATA;
  dialog = inject(MatDialog);

  ngOnInit() {
    const savedData: PeriodicElement[] = JSON.parse(localStorage.getItem('EmpData') || '[]');
    this.dataSource = savedData.length > 0 ? savedData : ELEMENT_DATA;
  }

  onSave(currentId: number) {
    const matchedRow = this.dataSource.find((d) => d.id === currentId);
    if (matchedRow) {
      console.log('Opening dialog with rowData:', matchedRow);
      const dialogRef = this.dialog.open(SaveConfirmationDialogComponent, {
        data: matchedRow
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.saveRowData(matchedRow);
        } else {
          console.log('Save operation cancelled');
        }
      });
    }
  }

  saveRowData(row: PeriodicElement) {
    let savedData: PeriodicElement[] = JSON.parse(localStorage.getItem('EmpData') || '[]');
    const index = savedData.findIndex((item) => item.id === row.id);
    if (index !== -1) {
      savedData[index] = row;
    } else {
      savedData.push(row);
    }
    localStorage.setItem('EmpData', JSON.stringify(savedData));
    this.dataSource = [...savedData];
    console.log('Saved Row Data:', row);
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
    <h1 mat-dialog-title>Confirm Save</h1>
    <div mat-dialog-content>
      Are you sure you want to save this Data?
      <div *ngIf="rowData">
      
        <p><strong>Full Name:</strong> <input type="text" [(ngModel)]="rowData.Fullname"></p>
        <p><strong>Contact Number:</strong> <input type="text" [(ngModel)]="rowData.Contactnumber"></p>
        <p><strong>Email:</strong> <input type="email" [(ngModel)]="rowData.Email"></p>
        <p><strong>Join Date:</strong> <input type="date" [(ngModel)]="rowData.Join_Date" [value]="parseDate(rowData.Join_Date)"></p>
        <p><strong>Last Updated Date:</strong> <input type="date" [(ngModel)]="rowData.Last_updated_Date" [value]="parseDate(rowData.Last_updated_Date)"></p>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onConfirm()">Save</button>
    </div>
  `,
})
export class SaveConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SaveConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData: PeriodicElement
  ) {console.log('rowData inside dialog:', this.rowData);}

  parseDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // Format as 'yyyy-mm-dd'
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}

export interface PeriodicElement {
  id: number;
  Fullname: string;
  Contactnumber: number;
  Email: string;
  Join_Date: string;
  Last_updated_Date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, Fullname: 'jay suthar', Contactnumber: 123456, Email: 'jay@gmail.com', Join_Date: '14 Dec 2020', Last_updated_Date: '16 Mar 2023' },
  { id: 2, Fullname: 'ajay patel', Contactnumber: 123456, Email: 'ajay@gmail.com', Join_Date: '10 Feb 2014', Last_updated_Date: '1 Jul 2024' },
  { id: 3, Fullname: 'om panchal', Contactnumber: 123456, Email: 'om@gmail.com', Join_Date: '5 Jan 2015', Last_updated_Date: '16 Apr 2018' },
  { id: 4, Fullname: 'abhay solanki', Contactnumber: 123456, Email: 'abhay@gmail.com', Join_Date: '1 Jun 2018', Last_updated_Date: '20 Sep 2021' },
];

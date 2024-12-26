import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserData } from '../models/user-data.model';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-save-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './save-confirmation-dialog.component.html',
})
export class SaveConfirmationDialogComponent {
  // Constructor with injected dialog reference and dialog data
  constructor(
    public dialogRef: MatDialogRef<SaveConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public rowData: UserData
  ) {
    console.log('Row Data inside Dialog:', this.rowData);
  }

  // Confirm method, sends updated rowData back to the parent component
  onConfirm() {
    console.log('Confirmed data:', this.rowData); // Log the confirmed data
    this.dialogRef.close(this.rowData); // Close the dialog and pass back rowData
  }

  // Cancel method, closes the dialog and sends 'false'
  onCancel() {
    console.log('Operation cancelled'); // Log the cancellation
    this.dialogRef.close(false); // Close the dialog without updating
  }
}

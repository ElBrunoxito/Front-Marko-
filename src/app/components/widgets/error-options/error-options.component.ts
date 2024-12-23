import { Component, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-options',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './error-options.component.html',
  styleUrl: './error-options.component.scss'
})
export class ErrorOptionsComponent {

  //title:string = "Error"


  


  constructor(
    public dialogRef: MatDialogRef<ErrorOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}

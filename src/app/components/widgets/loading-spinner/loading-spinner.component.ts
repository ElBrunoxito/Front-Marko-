import { NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent{

  @Input() loading: boolean = false; // Estado de carga
  @Input() errorMessage: string | null = null; // Mensaje de error


}

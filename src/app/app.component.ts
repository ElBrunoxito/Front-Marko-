import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OperationsFrontService } from './service/operations-front.service';
import { LoadingSpinnerComponent } from "./components/widgets/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoadingSpinnerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GestionMarkoFront';
  loading: boolean = false;  // Variable que manejará el estado de carga

  constructor(
    private operationsFrontService: OperationsFrontService,
    private cdr:ChangeDetectorRef

  ) {}

  ngOnInit() {
      this.operationsFrontService.loading$.subscribe((isLoading) => {
        this.loading = isLoading;
        this.cdr.detectChanges();

      });


  }

}

import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OperationsFrontService } from './service/operations-front.service';
import { LoadingSpinnerComponent } from "./components/widgets/loading-spinner/loading-spinner.component";
import { StorageService } from './interceptors/storage.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        LoadingSpinnerComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GestionMarkoFront';
  loading: boolean = false;  // Variable que manejará el estado de carga

  constructor(
    private operationsFrontService: OperationsFrontService,
    private cdr:ChangeDetectorRef,
    private storagewService:StorageService,
    private renderer: Renderer2

  ) {}

  ngOnInit() {
      this.operationsFrontService.loading$.subscribe((isLoading) => {
        this.loading = isLoading;
        this.cdr.detectChanges();

      });
      this.setIcon()


  }

  setIcon(){
    const url:string =  this.storagewService.getUrlImage()??""

    const head = document.querySelector('head');
    let link: HTMLLinkElement | null = document.querySelector("link[rel='icon']");

    if (link) {
      link.href = url
    } else {
      // Si no existe, crea uno nuevo
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'icon');
      this.renderer.setAttribute(link, 'href', url);
      //head?.appendChild(link);
    }

  }

}

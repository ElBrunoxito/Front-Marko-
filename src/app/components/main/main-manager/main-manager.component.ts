import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavLeftComponent } from '../nav-left/nav-left.component';
import { NavTopComponent } from "../nav-top/nav-top.component";
import { WebSocketService } from '../../../service/web-socket.service';

@Component({
    selector: 'app-main-manager',
    imports: [
        NavLeftComponent,
        RouterOutlet,
        NavTopComponent
    ],
    templateUrl: './main-manager.component.html',
    styleUrl: './main-manager.component.scss'
})
export class MainManagerComponent {

    stockMessage: string = '';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.connect();
    this.webSocketService.subscribeToStockUpdates().subscribe((message) => {
      this.stockMessage = message; 
      console.warn('Mensaje de stock recibido:', message);
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect(); 
  }

}













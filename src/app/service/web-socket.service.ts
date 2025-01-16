import { Injectable } from '@angular/core';
//import { Stomp } from '@stomp/stompjs';
//import * as SockJS from 'sockjs-client';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Client } from '@stomp/stompjs'; // Importación de STOMP
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private stompClient!: Client;
  private serverUrl = 'http://localhost:8080/ws'; // URL de WebSocket en tu servidor

  constructor() { }

  // Método para conectar al WebSocket
  connect(): void {
    // Crear la instancia de SockJS
    const socket = new SockJS(this.serverUrl); 

    // Crear el cliente STOMP usando la fábrica de WebSocket
    this.stompClient = new Client({
      brokerURL: this.serverUrl, // Configura la URL del broker
      webSocketFactory: () => socket, // Establece la fábrica de WebSocket
      connectHeaders: {
        // Puedes agregar cabeceras de autenticación si las necesitas
        Authorization: 'Bearer YOUR_JWT_TOKEN',
      },
      onConnect: () => {
        console.log('Conectado a WebSocket');
      },
      onDisconnect: () => {
        console.log('Desconectado de WebSocket');
      }
    });

    // Conectar
    this.stompClient.activate();
  }

  // Método para suscribirse a un canal
  subscribeToStockUpdates(): Observable<string> {
    return new Observable((observer) => {
      // Nos suscribimos a un canal específico en el servidor WebSocket
      this.stompClient.subscribe('/topic/stockUpdates', (message) => {
        if (message.body) {
          observer.next(message.body); // Emitir el mensaje recibido
        }
      });
    });
  }

  // Método para enviar un mensaje al servidor
  sendMessage(message: string): void {
    this.stompClient.publish({
      destination: '/app/stockUpdate',
      body: message,
    });
  }

  // Método para desconectar el WebSocket
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}

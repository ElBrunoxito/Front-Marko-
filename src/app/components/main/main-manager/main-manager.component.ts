import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavLeftComponent } from '../nav-left/nav-left.component';
import { NavTopComponent } from "../nav-top/nav-top.component";

@Component({
  selector: 'app-main-manager',
  standalone: true,
  imports: [
    NavLeftComponent,
    RouterOutlet,
    NavTopComponent
],
  templateUrl: './main-manager.component.html',
  styleUrl: './main-manager.component.scss'
})
export class MainManagerComponent {



}













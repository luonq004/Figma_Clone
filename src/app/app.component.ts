import { Component } from '@angular/core';
import { LiveComponent } from './live/live.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [LiveComponent, NavbarComponent],
})
export class AppComponent {}

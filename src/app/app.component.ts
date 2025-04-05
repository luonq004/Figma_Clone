import { Component } from '@angular/core';
import { LiveComponent } from './live/live.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [LiveComponent],
})
export class AppComponent {}

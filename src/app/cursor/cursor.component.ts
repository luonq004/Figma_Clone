import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.css',
})
export class CursorComponent {
  @Input() key: number | null = null;
  @Input() color: string = '';
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() message: string = '';
}

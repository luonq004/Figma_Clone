import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flying-reaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flying-reaction.component.html',
  styleUrl: './flying-reaction.component.css',
})
export class FlyingReactionComponent {
  @Input() x!: number;
  @Input() y!: number;
  @Input() timestamp!: number;
  @Input() value!: string;
}

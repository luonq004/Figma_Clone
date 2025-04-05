import { Component, Input } from '@angular/core';

@Component({
  selector: 'cursor-svg',
  standalone: true,
  templateUrl: './cursor-svg.component.html',
})
export class CursorSVGComponent {
  @Input() color!: string;
}

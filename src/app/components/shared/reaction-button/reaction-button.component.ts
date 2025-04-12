import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'reaction-button',
  standalone: true,
  imports: [],
  templateUrl: './reaction-button.component.html',
  styleUrl: './reaction-button.component.css',
})
export class ReactionButtonComponent {
  @Input() reaction!: string;
  @Output() handleSelect = new EventEmitter<string>();

  onHandleSelect(reaction: string) {
    this.handleSelect.emit(reaction);
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { ReactionButtonComponent } from '../components/shared/reaction-button/reaction-button.component';

@Component({
  selector: 'app-reaction',
  standalone: true,
  imports: [ReactionButtonComponent],
  templateUrl: './reaction.component.html',
  styleUrl: './reaction.component.css',
})
export class ReactionComponent {
  @Output() setReaction = new EventEmitter<string>();

  handleSelectReaction(reaction: string) {
    this.setReaction.emit(reaction);
  }
}

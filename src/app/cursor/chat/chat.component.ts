import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CursorMode, CursorState } from '../../../types/type';
import { CursorSVGComponent } from '../../components/shared/cursor-svg/cursor-svg.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, CursorSVGComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  @Input() cursorUser!: { cursor: { x: number; y: number }; message: string };
  @Input() modeState!: CursorState;

  // Two-way binding
  @Output() updateModeState = new EventEmitter<CursorState>();

  @Output() updateMyPresence = new EventEmitter<
    Partial<{
      cursor: { x: number; y: number } | null;
      cursorColor: string;
      message: string | null;
    }>
  >();

  cursor: any;

  isChatMode(): boolean {
    return this.modeState.mode === CursorMode.Chat;
  }

  handleChagne(e: Event) {
    const target = e.target as HTMLInputElement;

    this.updateMyPresence.emit({ message: target.value });
    this.updateModeState.emit({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: target.value,
    });
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.updateModeState.emit({
        mode: CursorMode.Chat,
        previousMessage: this.cursorUser.message,
        message: '',
      });
    } else if (e.key === 'Escape') {
      this.updateModeState.emit({
        mode: CursorMode.Hidden,
      });
    }
  }

  onKeyUp(event: KeyboardEvent) {
    event.stopPropagation();
  }

  get hasPreviousMessage(): boolean {
    return this.modeState.mode === CursorMode.Chat;
  }

  get messagePre(): string {
    return (
      (this.modeState.mode === CursorMode.Chat &&
        this.modeState.previousMessage) ||
      ''
    );
  }
}

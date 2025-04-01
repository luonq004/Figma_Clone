import { Component, Input } from '@angular/core';
import { BaseUserMeta, User } from '@liveblocks/client';
import { Presence } from '../../../types/type';
import { CommonModule } from '@angular/common';
import { CursorComponent } from '../cursor.component';
import { COLORS } from '../../../../constants';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [CommonModule, CursorComponent],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css',
})
export class LiveComponent {
  @Input() others: readonly User<Presence, BaseUserMeta>[] | null = null;
  colors = COLORS;

  trackByIndex(index: number, item: any): number {
    return index; // Trả về index để theo dõi vị trí của item
  }
}

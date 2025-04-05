import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BaseUserMeta, Room, User } from '@liveblocks/client';
import { Subscription } from 'rxjs';
import { COLORS } from '../../../constants';
import { CursorMode, CursorState, Presence } from '../../types/type';
import { ChatComponent } from '../cursor/chat/chat.component';
import { CursorComponent } from '../cursor/cursor.component';
import { LiveblocksService } from '../Services/liveblocks.service';
import { MouseHandleService } from '../Services/mousehandle.service';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [CommonModule, CursorComponent, ChatComponent],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css',
  providers: [MouseHandleService],
})
export class LiveComponent implements OnInit, OnDestroy {
  private room: Room | null = null;
  private subscriptions: Subscription[] = [];
  others: readonly User<Presence, BaseUserMeta>[] | null = null;
  colors = COLORS;

  cursor: any;

  cursorState: CursorState = {
    mode: CursorMode.Hidden,
  };

  constructor(
    private liveblocksService: LiveblocksService,
    private elementRef: ElementRef,
    private mouseService: MouseHandleService
  ) {}

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === '/') {
      this.cursorState = {
        mode: CursorMode.Chat,
        previousMessage: null,
        message: '',
      };
    } else if (event.key === 'Escape') {
      this.updateMyPresence({ message: '' });
      this.cursorState = {
        mode: CursorMode.Hidden,
      };
    } else if (event.key === 'e') {
      this.cursorState = {
        mode: CursorMode.ReactionSelector,
      };
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === '/') {
      event.preventDefault();
    }
  }

  ngOnInit() {
    this.room = this.liveblocksService.getRoom();

    if (this.room) {
      this.room.subscribe('others', (others) => {
        this.others = others;
      });
    }

    this.mouseService.attachMouseListeners(this.elementRef.nativeElement);

    this.subscriptions.push(
      this.mouseService.cursorPosition$.subscribe(({ x, y }) => {
        this.cursor = { cursor: { x, y } };
        this.updateMyPresence(this.cursor);
      })
    );

    this.subscriptions.push(
      this.mouseService.pointerLeave$.subscribe(() => {
        this.cursor = { cursor: null, message: null };
        this.cursorState.mode = CursorMode.Hidden;
        this.updateMyPresence(this.cursor);
      })
    );

    this.subscriptions.push(
      this.mouseService.pointerDown$.subscribe(({ x, y }) => {
        this.cursor = { cursor: { x, y } };
        this.updateMyPresence(this.cursor);
      })
    );
  }

  updateMyPresence(
    presence: Partial<{
      cursor: { x: number; y: number } | null;
      cursorColor: string;
      message: string | null;
    }>
  ) {
    // console.log(presence);
    this.room?.updatePresence(presence);
  }

  updateMode(state: CursorState) {
    this.cursorState = state;
  }

  trackByIndex(index: number, item: any): number {
    return index; // Trả về index để theo dõi vị trí của item
  }

  ngOnDestroy() {
    this.mouseService.detachMouseListeners(this.elementRef.nativeElement);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.room?.disconnect();
  }
}

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseUserMeta, Room, User } from '@liveblocks/client';
import { Subscription } from 'rxjs';
import { COLORS } from '../../../constants';
import {
  CursorMode,
  CursorState,
  Presence,
  Reaction,
  ReactionEvent,
} from '../../types/type';
import { ChatComponent } from '../cursor/chat/chat.component';
import { CursorComponent } from '../cursor/cursor.component';
import { LiveblocksService } from '../Services/liveblocks.service';
import { MouseHandleService } from '../Services/mousehandle.service';
import { ReactionComponent } from '../reaction/reaction.component';
import { FlyingReactionComponent } from '../reaction/flying-reaction/flying-reaction.component';
import { IntervalService } from '../Services/interval.service';

@Component({
  selector: 'app-live',
  standalone: true,
  imports: [
    CommonModule,
    CursorComponent,
    ChatComponent,
    ReactionComponent,
    FlyingReactionComponent,
  ],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css',
  providers: [MouseHandleService, IntervalService],
})
export class LiveComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() canvasReady: EventEmitter<HTMLCanvasElement> = new EventEmitter();

  private room: Room | null = null;
  private subscriptions: Subscription[] = [];

  others: readonly User<Presence, BaseUserMeta>[] | null = null;
  colors = COLORS;
  cursor: any;
  cursorState: CursorState = {
    mode: CursorMode.Hidden,
  };
  reaction: Reaction[] = [];

  constructor(
    private liveblocksService: LiveblocksService,
    private elementRef: ElementRef,
    private mouseService: MouseHandleService,
    private intervalService: IntervalService
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
    this.room = this.liveblocksService.enterRoomOnce();

    if (this.room) {
      this.room.subscribe('others', (others) => {
        this.others = others;
      });

      this.room.subscribe('event', (eventData) => {
        const event = eventData.event as ReactionEvent;

        this.reaction = this.reaction.concat([
          {
            point: {
              x: event.x,
              y: event.y,
            },
            value: event.value,
            timestamp: Date.now(),
          },
        ]);
      });
    }

    this.intervalService.startInterval(() => {
      if (
        this.cursorState.mode === CursorMode.Reaction &&
        this.cursorState.isPressed &&
        this.cursor
      ) {
        this.reaction = this.reaction.concat([
          {
            point: { x: this.cursor.cursor.x, y: this.cursor.cursor.y },
            value: this.cursorState.reaction,
            timestamp: Date.now(),
          },
        ]);

        this.room?.broadcastEvent({
          x: this.cursor.cursor.x,
          y: this.cursor.cursor.y,
          value: this.cursorState.reaction,
        });
      }
    }, 100);

    this.intervalService.startInterval(() => {
      this.reaction = this.reaction.filter(
        (r) => r.timestamp > Date.now() - 4000
      );
    }, 1000);

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

        if (this.cursorState.mode === CursorMode.Reaction) {
          this.cursorState = { ...this.cursorState, isPressed: true };
        }
      })
    );

    this.subscriptions.push(
      this.mouseService.pointerUp$.subscribe(() => {
        if (this.cursorState.mode === CursorMode.Reaction) {
          this.cursorState = { ...this.cursorState, isPressed: true };
        }
      })
    );
  }

  ngAfterViewInit() {
    this.canvasReady.emit(this.canvasRef.nativeElement);
  }

  updateMyPresence(
    presence: Partial<{
      cursor: { x: number; y: number } | null;
      cursorColor: string;
      message: string | null;
    }>
  ) {
    this.room?.updatePresence(presence);
  }

  updateMode(state: CursorState) {
    this.cursorState = state;
  }

  updateReaction(reaction: string) {
    this.cursorState = {
      mode: CursorMode.Reaction,
      reaction,
      isPressed: false,
    };
  }

  get isReactionState(): boolean {
    return this.cursorState.mode === CursorMode.ReactionSelector;
  }

  // getCanvasElement(): HTMLCanvasElement {
  //   return this.canvasRef.nativeElement;
  // }

  ngOnDestroy() {
    this.mouseService.detachMouseListeners(this.elementRef.nativeElement);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.room?.disconnect();
    this.intervalService.ngOnDestroy();
  }
}

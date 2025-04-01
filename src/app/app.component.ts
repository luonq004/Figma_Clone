import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { BaseUserMeta, Room, User } from '@liveblocks/client';
import { Subscription } from 'rxjs';
import { Presence } from '../types/type';
import { LiveblocksService } from './Services/liveblocks.service';
import { MouseHandleService } from './Services/mousehandle.service';
import { LiveComponent } from './cursor/live/live.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [LiveComponent],
  providers: [MouseHandleService],
})
export class AppComponent implements OnInit, OnDestroy {
  private room: Room | null = null;
  others: readonly User<Presence, BaseUserMeta>[] | null = null;

  x: number = 0;
  y: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private liveblocksService: LiveblocksService,
    private elementRef: ElementRef,
    private mouseService: MouseHandleService
  ) {}

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
        this.x = x;
        this.y = y;
        this.room?.updatePresence({ cursor: { x, y } });
      })
    );

    this.subscriptions.push(
      this.mouseService.pointerLeave$.subscribe(() => {
        this.room?.updatePresence({ cursor: null, message: null });
      })
    );

    this.subscriptions.push(
      this.mouseService.pointerDown$.subscribe(({ x, y }) => {
        console.log(`Mouse Down at: ${x}, ${y}`);
      })
    );
  }

  updateMyPresence(data: any) {
    console.log('Updating presence:', data);
  }

  ngOnDestroy() {
    this.mouseService.detachMouseListeners(this.elementRef.nativeElement);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.room?.disconnect();
  }
}

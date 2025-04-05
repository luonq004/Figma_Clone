import { inject, Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MouseHandleService {
  private cursorPosition = new Subject<{ x: number; y: number }>();
  private pointerLeave = new Subject<void>();
  private pointerDown = new Subject<{ x: number; y: number }>();

  cursorPosition$ = this.cursorPosition.asObservable();
  pointerLeave$ = this.pointerLeave.asObservable();
  pointerDown$ = this.pointerDown.asObservable();

  constructor(private ngZone: NgZone) {}

  attachMouseListeners(target: HTMLElement) {
    this.ngZone.runOutsideAngular(() => {
      target.addEventListener('pointermove', this.handlePointerMove);
      target.addEventListener('pointerleave', this.handlePointerLeave);
      target.addEventListener('pointerdown', this.handlePointerDown);
    });
  }

  detachMouseListeners(target: HTMLElement) {
    target.removeEventListener('pointermove', this.handlePointerMove);
    target.removeEventListener('pointerleave', this.handlePointerLeave);
    target.removeEventListener('pointerdown', this.handlePointerDown);
  }

  private handlePointerMove = (event: PointerEvent) => {
    event.preventDefault();
    this.emitCursorPosition(event);
  };

  private handlePointerDown = (event: PointerEvent) => {
    event.preventDefault();
    this.emitPointerDown(event);
  };

  private handlePointerLeave = () => {
    this.ngZone.run(() => {
      this.pointerLeave.next();
    });
  };

  private emitCursorPosition(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;

    this.ngZone.run(() => {
      this.cursorPosition.next({ x, y });
    });
  }

  private emitPointerDown(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;

    this.ngZone.run(() => {
      this.pointerDown.next({ x, y });
    });
  }
}

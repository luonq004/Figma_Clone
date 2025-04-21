import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MouseHandleService {
  private cursorPosition = new Subject<{ x: number; y: number }>();
  private pointerLeave = new Subject<void>();
  private pointerDown = new Subject<{ x: number; y: number }>();
  private pointerUp = new Subject<void>();

  cursorPosition$ = this.cursorPosition.asObservable();
  pointerLeave$ = this.pointerLeave.asObservable();
  pointerDown$ = this.pointerDown.asObservable();
  pointerUp$ = this.pointerUp.asObservable();

  constructor(private ngZone: NgZone) {}

  attachMouseListeners(target: HTMLElement) {
    this.ngZone.runOutsideAngular(() => {
      target.addEventListener('pointermove', this.handlePointerMove);
      target.addEventListener('pointerleave', this.handlePointerLeave);
      target.addEventListener('pointerdown', this.handlePointerDown);
      target.addEventListener('pointerup', this.handlePointerUp);
    });
  }

  detachMouseListeners(target: HTMLElement) {
    target.removeEventListener('pointermove', this.handlePointerMove);
    target.removeEventListener('pointerleave', this.handlePointerLeave);
    target.removeEventListener('pointerdown', this.handlePointerDown);
    target.removeEventListener('pointerup', this.handlePointerUp);
  }

  private handlePointerMove = (event: PointerEvent) => {
    // event.preventDefault();
    this.emitCursorPosition(event);
  };

  private handlePointerDown = (event: PointerEvent) => {
    // event.preventDefault();
    this.emitPointerDown(event);
  };

  private handlePointerLeave = () => {
    this.ngZone.run(() => {
      this.pointerLeave.next();
    });
  };

  private handlePointerUp = () => {
    this.ngZone.run(() => {
      this.pointerUp.next();
    });
  };

  private emitCursorPosition(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    this.ngZone.run(() => {
      this.cursorPosition.next({ x, y });
    });
  }

  private emitPointerDown(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    this.ngZone.run(() => {
      this.pointerDown.next({ x, y });
    });
  }
}

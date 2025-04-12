import { Injectable, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class IntervalService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor() {}

  startInterval(callback: () => void, delay: number): void {
    interval(delay)
      .pipe(takeUntil(this.destroy$)) // Stop interval when component is destroyed
      .subscribe(() => callback());
  }

  // Cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// drawState.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fabric } from 'fabric';
import { createSpecificShape } from '../../lib/shapes';

@Injectable({ providedIn: 'root' })
export class DrawStateService {
  fabricRef: fabric.Canvas | null = null;
  shapeRef: fabric.Object | null = null;

  private isDrawingSubject = new BehaviorSubject<boolean>(false);
  isDrawing$ = this.isDrawingSubject.asObservable();

  private selectedShapeSubject = new BehaviorSubject<string>('rectangle');
  selectedShape$ = this.selectedShapeSubject.asObservable();

  setIsDrawing(val: boolean) {
    this.isDrawingSubject.next(val);
  }

  get isDrawing(): boolean {
    return this.isDrawingSubject.value;
  }

  get selectedShapeRef(): string {
    return this.selectedShapeSubject.value;
  }

  setSelectedShape(shape: string): void {
    this.selectedShapeSubject.next(shape);
  }

  handleCanvasMouseDown(options: fabric.IEvent) {
    const canvas = this.fabricRef;
    if (!canvas) return;

    const pointer = canvas.getPointer(options.e);
    const target = canvas.findTarget(options.e, false);
    canvas.isDrawingMode = false;

    const selectedShapeRef = this.selectedShapeRef;

    if (selectedShapeRef === 'freeform') {
      this.setIsDrawing(true);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 5;
      return;
    }

    if (
      target &&
      (target.type === selectedShapeRef || target.type === 'activeSelection')
    ) {
      this.setIsDrawing(false);
      canvas.setActiveObject(target);
      target.setCoords();
    } else {
      this.setIsDrawing(true);
      this.shapeRef = createSpecificShape(selectedShapeRef, pointer as any);
      if (this.shapeRef) {
        canvas.add(this.shapeRef);
      }
    }
  }
}

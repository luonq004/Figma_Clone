// drawState.service.ts
import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { BehaviorSubject } from 'rxjs';
import { createSpecificShape } from '../../lib/shapes';

import { v4 as uuidv4 } from 'uuid';
import { defaultNavElement } from '../../../constants';
import {
  ActiveElement,
  Attributes,
  CustomFabricObject,
} from '../../types/type';

@Injectable({ providedIn: 'root' })
export class DrawStateService {
  canvas: fabric.Canvas | null = null;
  fabricRef: fabric.Canvas | null = null;
  shapeRef: fabric.Object | null | any = null;
  activeObjectRef: fabric.Object | null | any = null;
  isEditing: boolean | null = null;

  private isDrawingSubject = new BehaviorSubject<boolean>(false);
  isDrawing$ = this.isDrawingSubject.asObservable();

  private selectedShapeSubject = new BehaviorSubject<string | null>(null);
  selectedShape$ = this.selectedShapeSubject.asObservable();

  setIsDrawing(val: boolean) {
    this.isDrawingSubject.next(val);
  }

  get isDrawing(): boolean {
    return this.isDrawingSubject.value;
  }

  get selectedShapeRef(): string | null {
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
      this.shapeRef = createSpecificShape(selectedShapeRef!, pointer as any);
      if (this.shapeRef) {
        canvas.add(this.shapeRef);
      }
    }
  }

  handleCanvaseMouseMove(
    options: fabric.IEvent,
    syncShapeInStorage: (shape: fabric.Object) => void
  ) {
    if (!this.isDrawing) return;
    if (this.selectedShapeRef === 'freeform') return;
    const canvas = this.fabricRef;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    const pointer = canvas.getPointer(options.e);

    switch (this.selectedShapeRef) {
      case 'rectangle':
        this.shapeRef?.set({
          width: pointer.x - (this.shapeRef?.left || 0),
          height: pointer.y - (this.shapeRef?.top || 0),
        });
        break;

      case 'circle':
        (this.shapeRef as fabric.Circle).set({
          radius: Math.abs(pointer.x - (this.shapeRef?.left || 0)),
        });
        break;

      case 'triangle':
        this.shapeRef?.set({
          width: pointer.x - (this.shapeRef?.left || 0),
          height: pointer.y - (this.shapeRef?.top || 0),
        });
        break;

      case 'line':
        (this.shapeRef as fabric.Line).set({
          x2: pointer.x,
          y2: pointer.y,
        });
        break;

      case 'image':
        this.shapeRef?.set({
          width: pointer.x - (this.shapeRef?.left || 0),
          height: pointer.y - (this.shapeRef?.top || 0),
        });
        break;

      default:
        break;
    }

    canvas.renderAll();

    // sync shape in storage
    if (this.shapeRef?.objectId) {
      syncShapeInStorage(this.shapeRef);
    }
  }

  handleKeyDown(
    e: KeyboardEvent,
    undo: () => void,
    redo: () => void,
    syncShapeInStorage: (shape: fabric.Object) => void,
    deleteShapeFromStorage: (id: string) => void
  ) {
    // Check if the key pressed is ctrl/cmd + c (copy)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
      this.handleCopy();
    }

    // Check if the key pressed is ctrl/cmd + v (paste)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
      this.handlePaste(syncShapeInStorage);
    }

    // Check if the key pressed is delete/backspace (delete)
    // if (e.keyCode === 8 || e.keyCode === 46) {
    //   handleDelete(canvas, deleteShapeFromStorage);
    // }

    // check if the key pressed is ctrl/cmd + x (cut)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
      this.handleCopy();
      this.handleDelete(deleteShapeFromStorage);
    }

    // check if the key pressed is ctrl/cmd + z (undo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 90) {
      console.log('z');
      undo();
    }

    // check if the key pressed is ctrl/cmd + y (redo)
    if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 89) {
      redo();
    }

    if (e.keyCode === 191 && !e.shiftKey) {
      e.preventDefault();
    }
  }

  handleCanvasMouseUp(
    syncShapeInStorage: (shape: fabric.Object) => void,
    setActiveElement: (element: ActiveElement) => void
  ) {
    const canvas = this.fabricRef;
    if (!canvas) return;

    this.setIsDrawing(false);
    if (this.selectedShapeRef === 'freeform') return;

    // sync shape in storage as drawing is stopped
    syncShapeInStorage(this.shapeRef);

    // set everything to null
    this.shapeRef = null;
    this.activeObjectRef = null;
    this.setSelectedShape('');

    // if canvas is not in drawing mode, set active element to default nav element after 700ms
    if (!canvas.isDrawingMode) {
      setTimeout(() => {
        setActiveElement(defaultNavElement);
      }, 700);
    }
  }

  handleCanvasObjectModified(
    options: fabric.IEvent,
    syncShapeInStorage: (shape: fabric.Object) => void
  ) {
    const target = options.target;
    if (!target) return;

    if (target?.type == 'activeSelection') {
      // fix this
    } else {
      syncShapeInStorage(target);
    }
  }

  renderCanvas(canvasObjects: any) {
    // clear canvas
    this.fabricRef?.clear();

    // render all objects on canvas
    Array.from(canvasObjects, ([objectId, objectData]) => {
      /**
       * enlivenObjects() is used to render objects on canvas.
       * It takes two arguments:
       * 1. objectData: object data to render on canvas
       * 2. callback: callback function to execute after rendering objects
       * on canvas
       *
       * enlivenObjects: http://fabricjs.com/docs/fabric.util.html#.enlivenObjectEnlivables
       */
      fabric.util.enlivenObjects(
        [objectData],
        (enlivenedObjects: fabric.Object[]) => {
          enlivenedObjects.forEach((enlivenedObj) => {
            // if element is active, keep it in active state so that it can be edited further
            if (this.activeObjectRef?.objectId === objectId) {
              this.fabricRef?.setActiveObject(enlivenedObj);
            }

            // add object to canvas
            this.fabricRef?.add(enlivenedObj);
          });
        },
        /**
         * specify namespace of the object for fabric to render it on canvas
         * A namespace is a string that is used to identify the type of
         * object.
         *
         * Fabric Namespace: http://fabricjs.com/docs/fabric.html
         */
        'fabric'
      );
    });

    this.fabricRef?.renderAll();
  }

  handleDelete(deleteShapeFromStorage: (id: string) => void) {
    const activeObject = this.fabricRef?.getActiveObject() as any;
    if (!activeObject) return;

    // Nếu là nhóm nhiều object (multi-select)
    if (activeObject.type === 'activeSelection') {
      const objects = activeObject.getObjects();
      objects.forEach((obj: CustomFabricObject<any>) => {
        if (!obj.objectId) return;
        this.fabricRef?.remove(obj);
        deleteShapeFromStorage(obj.objectId);
      });
    } else {
      // Chỉ có một object được chọn
      if (!activeObject.objectId) return;
      this.fabricRef?.remove(activeObject);
      deleteShapeFromStorage(activeObject.objectId);
    }

    this.fabricRef?.discardActiveObject().renderAll(); // clear selection + re-render
  }

  handleCanvasSelectionCreated(
    options: fabric.IEvent,
    handleSetElementAttributes: (element: Attributes) => void
  ) {
    // if user is editing manually, return
    if (this.isEditing) return;

    // console.log(options);
    // if no element is selected, return
    if (!options?.selected) return;

    // get the selected element
    const selectedElement = options?.selected[0] as fabric.Object;

    // if only one element is selected, set element attributes
    if (selectedElement && options.selected.length === 1) {
      // calculate scaled dimensions of the object
      const scaledWidth = selectedElement?.scaleX
        ? selectedElement?.width! * selectedElement?.scaleX
        : selectedElement?.width;

      const scaledHeight = selectedElement?.scaleY
        ? selectedElement?.height! * selectedElement?.scaleY
        : selectedElement?.height;

      handleSetElementAttributes({
        width: scaledWidth?.toFixed(0).toString() || '',
        height: scaledHeight?.toFixed(0).toString() || '',
        fill: selectedElement?.fill?.toString() || '',
        stroke: selectedElement?.stroke || '',
        // @ts-ignore
        fontSize: selectedElement?.fontSize || '',
        // @ts-ignore
        fontFamily: selectedElement?.fontFamily || '',
        // @ts-ignore
        fontWeight: selectedElement?.fontWeight || '',
      });
    }
  }

  handleCanvasObjectScaling(
    options: fabric.IEvent,
    handleSetElementAttributes: (element: Attributes) => void
  ) {
    const selectedElement = options.target;

    // calculate scaled dimensions of the object
    const scaledWidth = selectedElement?.scaleX
      ? selectedElement?.width! * selectedElement?.scaleX
      : selectedElement?.width;

    const scaledHeight = selectedElement?.scaleY
      ? selectedElement?.height! * selectedElement?.scaleY
      : selectedElement?.height;

    handleSetElementAttributes({
      width: scaledWidth?.toFixed(0).toString() || '',
      height: scaledHeight?.toFixed(0).toString() || '',
      fill: selectedElement?.fill?.toString() || '',
      stroke: selectedElement?.stroke || '',
      // @ts-ignore
      fontSize: selectedElement?.fontSize || '',
      // @ts-ignore
      fontFamily: selectedElement?.fontFamily || '',
      // @ts-ignore
      fontWeight: selectedElement?.fontWeight || '',
    });
  }

  handleImageUpload(
    file: File,
    syncShapeInStorage: (shape: fabric.Object) => void
  ) {
    const reader = new FileReader();

    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string, (img) => {
        img.scaleToWidth(200);
        img.scaleToHeight(200);

        this.fabricRef?.add(img);

        // @ts-ignore
        img.objectId = uuidv4();

        this.shapeRef = img;
        syncShapeInStorage(img);
        this.fabricRef?.requestRenderAll();
      });
    };

    reader.readAsDataURL(file);
  }

  handleResize = () => {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return;

    if (!this.fabricRef) return;

    // console.log(canvasElement.clientWidth, canvasElement.clientHeight);

    this.fabricRef.setDimensions({
      width: canvasElement.clientWidth,
      height: canvasElement.clientHeight,
    });
  };

  handleCopy = () => {
    const activeObjects = this.fabricRef?.getActiveObjects();
    if (!activeObjects) return;

    if (activeObjects.length > 0) {
      // Serialize the selected objects
      const serializedObjects = activeObjects.map((obj) => obj.toObject());
      // Store the serialized objects in the clipboard
      localStorage.setItem('clipboard', JSON.stringify(serializedObjects));
    }

    return activeObjects;
  };

  modifyShape(
    property: string,
    value: any,
    syncShapeInStorage: (shape: fabric.Object) => void
  ) {
    const selectedElement = this.fabricRef?.getActiveObject();

    if (!selectedElement || selectedElement?.type === 'activeSelection') return;

    // if  property is width or height, set the scale of the selected element
    if (property === 'width') {
      selectedElement.set('scaleX', 1);
      selectedElement.set('width', +value.target.value);
    } else if (property === 'height') {
      selectedElement.set('scaleY', 1);
      selectedElement.set('height', +value.target.value);
    } else {
      if (
        selectedElement[property as keyof object] ===
        +(value.target as HTMLInputElement).value
      )
        return;

      selectedElement.set(property as keyof fabric.Object, +value.target.value);
    }

    // set selectedElement to activeObjectRef
    this.activeObjectRef = selectedElement;

    syncShapeInStorage(selectedElement);
  }

  handlePaste = (syncShapeInStorage: (shape: fabric.Object) => void) => {
    if (!this.fabricRef || !(this.fabricRef instanceof fabric.Canvas)) {
      console.error('Invalid canvas object. Aborting paste operation.');
      return;
    }

    // Retrieve serialized objects from the clipboard
    const clipboardData = localStorage.getItem('clipboard');

    if (clipboardData) {
      try {
        const parsedObjects = JSON.parse(clipboardData);
        parsedObjects.forEach((objData: fabric.Object) => {
          // convert the plain javascript objects retrieved from localStorage into fabricjs objects (deserialization)
          fabric.util.enlivenObjects(
            [objData],
            (enlivenedObjects: fabric.Object[]) => {
              enlivenedObjects.forEach((enlivenedObj) => {
                // Offset the pasted objects to avoid overlap with existing objects
                enlivenedObj.set({
                  left: enlivenedObj.left || 0 + 20,
                  top: enlivenedObj.top || 0 + 20,
                  objectId: uuidv4(),
                  fill: '#aabbcc',
                } as CustomFabricObject<any>);

                this.fabricRef?.add(enlivenedObj);
                syncShapeInStorage(enlivenedObj);
              });
              this.fabricRef?.renderAll();
            },
            'fabric'
          );
        });
      } catch (error) {
        console.error('Error parsing clipboard data:', error);
      }
    }
  };
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { defaultNavElement } from '../../constants';
import { initializeFabric } from '../lib/canvas';
import { ActiveElement, Attributes } from '../types/type';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { LiveComponent } from './live/live.component';
import { DrawStateService } from './Services/drawState.service';
import { LiveblocksService } from './Services/liveblocks.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    LiveComponent,
    NavbarComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
  ],
  providers: [DrawStateService],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild(LiveComponent) liveCom!: LiveComponent;
  @ViewChild(NavbarComponent) navbarRef!: NavbarComponent;
  @ViewChild('check') imageInputRef!: ElementRef<HTMLInputElement>;

  drawStateService: DrawStateService = inject(DrawStateService);
  liveBlockService: LiveblocksService = inject(LiveblocksService);

  activeElement: ActiveElement = {
    name: '',
    value: '',
    icon: '',
  };

  elementAttributes: Attributes = {
    width: '',
    height: '',
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fill: '#aabbcc',
    stroke: '#aabbcc',
  };

  private resizeListener = () => this.drawStateService.handleResize();

  private canvasSubscription?: Subscription;

  ngAfterViewInit(): void {
    const initializedCanvas = initializeFabric({
      canvasRef: this.liveCom.canvasRef.nativeElement,
    });

    const canvas = initializedCanvas!;
    this.drawStateService.fabricRef = canvas;

    this.canvasSubscription = this.liveBlockService.canvasObjects$.subscribe(
      (canvasObjects) => {
        if (canvasObjects) {
          this.drawStateService.renderCanvas(canvasObjects);
        }
      }
    );

    canvas.on('mouse:down', (options) => {
      this.drawStateService.handleCanvasMouseDown(options);
    });

    canvas.on('mouse:move', (options) => {
      this.drawStateService.handleCanvaseMouseMove(options, (object) =>
        this.syncShapeInStorage(object as fabric.Object & { objectId: string })
      );
    });

    canvas.on('mouse:up', () => {
      this.drawStateService.handleCanvasMouseUp(
        (object) =>
          this.syncShapeInStorage(
            object as fabric.Object & { objectId: string }
          ),
        (element) => this.handleSetActiveElement(element as ActiveElement)
      );
    });

    canvas.on('object:modified', (options) => {
      this.drawStateService.handleCanvasObjectModified(options, (object) =>
        this.syncShapeInStorage(object as fabric.Object & { objectId: string })
      );
    });

    canvas.on('selection:created', (options) => {
      this.drawStateService.handleCanvasSelectionCreated(options, (element) =>
        this.handleSetElementAttributes(element)
      );
    });

    canvas.on('selection:updated', (options) => {
      console.log('ad');
      this.drawStateService.handleCanvasSelectionCreated(options, (element) =>
        this.handleSetElementAttributes(element)
      );
    });

    canvas.on('object:scaling', (options) => {
      this.drawStateService.handleCanvasObjectScaling(options, (element) =>
        this.handleSetElementAttributes(element)
      );
    });

    // Lắng nghe resize
    window.addEventListener('resize', this.drawStateService.handleResize);

    window.addEventListener('keydown', (e) =>
      this.drawStateService.handleKeyDown(
        e,
        () => this.liveBlockService.handleUndo(),
        () => this.liveBlockService.handleRedo(),
        (object) =>
          this.syncShapeInStorage(
            object as fabric.Object & { objectId: string }
          ),
        () =>
          this.drawStateService.handleDelete((id) =>
            this.deleteShapeFromStorage(id)
          )
      )
    );
  }

  async syncShapeInStorage(object: fabric.Object & { objectId: string }) {
    if (!object) return;
    const { objectId } = object;

    const shapeData = {
      ...object.toJSON(),
      objectId: objectId,
    };

    this.liveBlockService.canvasObjects$.value?.set(objectId, shapeData);

    // this.liveBlockService.canvasObjects$.next(
    //   this.liveBlockService.canvasObjects$.value
    // );
  }

  handleActiveElement(elem: ActiveElement) {
    this.activeElement = elem;

    switch (elem?.value) {
      // delete all the shapes from the canvas
      case 'reset':
        //   // clear the storage
        this.deleteAllShapes();
        //   // clear the canvas
        this.drawStateService.fabricRef?.clear();
        //   // set "select" as the active element
        this.handleSetActiveElement(defaultNavElement);
        break;

      // delete the selected shape from the canvas
      case 'delete':
        // delete it from the canvas
        this.drawStateService.handleDelete((id) =>
          this.deleteShapeFromStorage(id)
        );
        // set "select" as the active element
        this.handleSetActiveElement(defaultNavElement);
        break;

      // upload an image to the canvas
      case 'image':
        //   // trigger the click event on the input element which opens the file dialog
        //   imageInputRef.current?.click();
        this.imageInputRef.nativeElement.click();
        //   /**
        //    * set drawing mode to false
        //    * If the user is drawing on the canvas, we want to stop the
        //    * drawing mode when clicked on the image item from the dropdown.
        //    */
        this.drawStateService.setIsDrawing(false);

        if (this.drawStateService.fabricRef) {
          //     // disable the drawing mode of canvas
          this.drawStateService.fabricRef.isDrawingMode = false;
        }
        break;

      // for comments, do nothing
      case 'comments':
        break;

      default:
        // set the selected shape to the selected element
        this.drawStateService.setSelectedShape(elem?.value as string);
        break;
    }
  }

  handleImageUpload(e: any) {
    this.drawStateService.handleImageUpload(e.target.files[0], (object) =>
      this.syncShapeInStorage(object as fabric.Object & { objectId: string })
    );
  }

  handleSetActiveElement(element: ActiveElement) {
    this.activeElement = element;
  }

  handleSetElementAttributes(
    payload:
      | { property: keyof Attributes | string; value: string }
      | Partial<Attributes>
  ) {
    if ('property' in payload && 'value' in payload) {
      // Cập nhật một property
      this.elementAttributes = {
        ...this.elementAttributes,
        [payload.property]: payload.value,
      };
    } else {
      // Cập nhật nhiều property (chỉ những cái được truyền vào)
      this.elementAttributes = {
        ...this.elementAttributes,
        ...payload,
      };
    }
  }

  deleteAllShapes(): boolean {
    if (
      !this.liveBlockService.canvasObjects$.value ||
      this.liveBlockService.canvasObjects$.value.size === 0
    )
      return true;

    for (const [
      key,
      value,
    ] of this.liveBlockService.canvasObjects$.value.entries()) {
      this.liveBlockService.canvasObjects$.value.delete(key);
    }

    return this.liveBlockService.canvasObjects$.value.size === 0;
  }

  deleteShapeFromStorage(id: string) {
    this.liveBlockService.canvasObjects$.value?.delete(id);
  }

  ngOnDestroy(): void {
    if (this.drawStateService.fabricRef) {
      this.drawStateService.fabricRef.dispose();
    }

    window.removeEventListener('resize', this.resizeListener);

    window.removeEventListener('keydown', (e) =>
      this.drawStateService.handleKeyDown(
        e,
        () => this.liveBlockService.handleUndo(),
        () => this.liveBlockService.handleRedo(),
        (object) =>
          this.syncShapeInStorage(
            object as fabric.Object & { objectId: string }
          ),
        () =>
          this.drawStateService.handleDelete((id) =>
            this.deleteShapeFromStorage(id)
          )
      )
    );

    this.canvasSubscription?.unsubscribe();
  }
}

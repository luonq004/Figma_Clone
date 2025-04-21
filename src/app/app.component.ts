import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from '../lib/canvas';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { LiveComponent } from './live/live.component';
import { DrawStateService } from './Services/drawState.service';
import { ActiveElement } from '../types/type';

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
// export class AppComponent {
export class AppComponent implements AfterViewInit {
  @ViewChild(LiveComponent) liveCom!: LiveComponent;
  drawStateService: DrawStateService = inject(DrawStateService);

  activeElement: ActiveElement = {
    name: '',
    value: '',
    icon: '',
  };

  ngAfterViewInit(): void {
    const initializedCanvas = initializeFabric({
      canvasRef: this.liveCom.canvasRef.nativeElement,
    });

    const canvas = initializedCanvas!;
    this.drawStateService.fabricRef = canvas;

    canvas.on('mouse:down', (options) => {
      this.drawStateService.handleCanvasMouseDown(options);
    });

    window.addEventListener('resize', () =>
      handleResize({ canvas: this.drawStateService.fabricRef })
    );
  }

  handleActiveElement(elem: ActiveElement) {
    this.activeElement = elem;

    console.log(elem);

    switch (elem?.value) {
      // delete all the shapes from the canvas
      // case "reset":
      //   // clear the storage
      //   deleteAllShapes();
      //   // clear the canvas
      //   fabricRef.current?.clear();
      //   // set "select" as the active element
      //   setActiveElement(defaultNavElement);
      //   break;

      // delete the selected shape from the canvas
      // case "delete":
      //   // delete it from the canvas
      //   handleDelete(fabricRef.current as any, deleteShapeFromStorage);
      //   // set "select" as the active element
      //   setActiveElement(defaultNavElement);
      //   break;

      // upload an image to the canvas
      // case "image":
      //   // trigger the click event on the input element which opens the file dialog
      //   imageInputRef.current?.click();
      //   /**
      //    * set drawing mode to false
      //    * If the user is drawing on the canvas, we want to stop the
      //    * drawing mode when clicked on the image item from the dropdown.
      //    */
      //   isDrawing.current = false;

      //   if (fabricRef.current) {
      //     // disable the drawing mode of canvas
      //     fabricRef.current.isDrawingMode = false;
      //   }
      //   break;

      // for comments, do nothing
      case 'comments':
        break;

      default:
        // set the selected shape to the selected element
        this.drawStateService.setSelectedShape(elem?.value as string);
        console.log(elem?.value);

        break;
    }
  }
}

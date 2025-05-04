import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Attributes } from '../../../types/type';
import { DrawStateService } from '../../Services/drawState.service';
import { DemensionsComponent } from '../dimensions/dimensions.component';
import { TextComponent } from '../text/text.component';
import { ColorComponent } from '../color/color.component';
import { ExportComponent } from '../export/export.component';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [
    DemensionsComponent,
    TextComponent,
    ColorComponent,
    ExportComponent,
  ],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.css',
})
export class RightSidebarComponent {
  @Input() elementAttributes!: Attributes;

  @Output() setElementAttributes = new EventEmitter<
    { property: keyof Attributes | string; value: string } | Partial<Attributes>
  >();

  @Output() syncShapeInStorage = new EventEmitter<
    fabric.Object & { objectId: string }
  >();

  drawStateServices: DrawStateService = inject(DrawStateService);

  handleInputChange(
    payload:
      | { property: keyof Attributes | string; value: string }
      | Partial<Attributes>
  ) {
    // if (!this.drawStateServices.isEditing)
    //   this.drawStateServices.isEditing = true;

    this.setElementAttributes.emit(payload);

    if ('property' in payload && 'value' in payload) {
      this.drawStateServices.modifyShape(
        payload.property,
        payload.value,
        (object) =>
          this.syncShapeInStorage.emit(
            object as fabric.Object & { objectId: string }
          )
      );
    }
  }

  handleBlurInput() {
    // this.drawStateServices.isEditing = false;
  }
}

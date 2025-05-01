import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActiveElement, NestedElement } from '../../../types/type';
import { DrawStateService } from '../../Services/drawState.service';
import { LiveblocksService } from '../../Services/liveblocks.service';
import { MATERIAL_STANDALONE_MODULES } from '../shared/material-standalone';

@Component({
  selector: 'shapes-menu',
  standalone: true,
  imports: [MATERIAL_STANDALONE_MODULES, CommonModule],
  templateUrl: './shapes-menu.component.html',
  styleUrl: './shapes-menu.component.css',
  providers: [DrawStateService, LiveblocksService],
})
export class ShapesMenuComponent {
  drawStateService: DrawStateService = inject(DrawStateService);
  liveBlockService: LiveblocksService = inject(LiveblocksService);

  @Input() item!: NestedElement | any;
  @Input() activeElement!: ActiveElement;

  @Output() handleActiveElement = new EventEmitter<ActiveElement>();

  handleActive(elem: any) {
    if (typeof elem.value === 'string') {
      this.handleActiveElement.emit(elem as ActiveElement);
    }
  }

  syncShapeInStorage() {}

  handleUploadImage(e: any) {
    e.stopPropagation();

    // this.liveBlockService.syncShapeInStorage(object);
    // this.drawStateService.handleImageUpload({ file: e.target.files[0] });
  }

  get isMenuElement() {
    return this.item.value.some(
      (elem: ActiveElement) => elem?.value === this.activeElement?.value
    );
  }
}

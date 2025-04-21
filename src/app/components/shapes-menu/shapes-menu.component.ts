import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActiveElement, NestedElement } from '../../../types/type';
import { MATERIAL_STANDALONE_MODULES } from '../shared/material-standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shapes-menu',
  standalone: true,
  imports: [MATERIAL_STANDALONE_MODULES, CommonModule],
  templateUrl: './shapes-menu.component.html',
  styleUrl: './shapes-menu.component.css',
})
export class ShapesMenuComponent {
  @Input() item!: NestedElement | any;

  @Input() activeElement!: ActiveElement;
  @Input() imageInput: HTMLElement | null = null;

  @Output() handleImageUpload!: (e: Event) => void;
  @Output() handleActiveElement = new EventEmitter<ActiveElement>();

  handleActive(elem: any) {
    if (typeof elem.value === 'string') {
      this.handleActiveElement.emit(elem as ActiveElement);
    }
  }

  get isMenuElement() {
    return this.item.value.some(
      (elem: ActiveElement) => elem?.value === this.activeElement?.value
    );
  }
}

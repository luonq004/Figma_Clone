import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { navElements } from '../../../../constants';
import { ActiveElement } from '../../../types/type';
import { CommonModule } from '@angular/common';
import { ActiveComponent } from '../../active/active.component';
import { ShapesMenuComponent } from '../shapes-menu/shapes-menu.component';
import { NewThreadComponent } from '../new-thread/new-thread.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ActiveComponent,
    ShapesMenuComponent,
    NewThreadComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() activeElement!: ActiveElement;
  @Input() imageInputRef!: ElementRef<HTMLInputElement>;
  @Output() handleImageUpload!: (e: Event) => void;
  @Output() handleActiveElement = new EventEmitter<ActiveElement>();

  navItems = navElements;

  isArray(item: string | any[]): boolean {
    if (Array.isArray(item)) {
      return true;
    }
    return false;
  }

  isComment(item: any): boolean {
    if (item == 'comments') {
      return true;
    }
    return false;
  }

  handleActive(elem: any) {
    if (typeof elem.value === 'string') {
      this.handleActiveElement.emit(elem as ActiveElement);
    }
  }

  isActive = (value: string | Array<ActiveElement>) =>
    (this.activeElement && this.activeElement.value === value) ||
    (Array.isArray(value) &&
      value.some((val) => val?.value === this.activeElement?.value));
}

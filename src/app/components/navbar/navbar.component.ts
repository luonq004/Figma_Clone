import { Component, ElementRef, Input, Output } from '@angular/core';
import { navElements } from '../../../../constants';
import { ActiveElement } from '../../../types/type';
import { CommonModule } from '@angular/common';
import { ActiveComponent } from '../../active/active.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ActiveComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() activeElement!: ActiveElement;
  @Input() imageInputRef!: ElementRef<HTMLInputElement>;
  @Output() handleImageUpload!: (e: Event) => void;
  @Output() handleActiveElement!: (element: ActiveElement) => void;

  navElement = navElements;
  // isActive = (value: string | Array<ActiveElement>) =>
  //   (this.activeElement && this.activeElement.value === value) ||
  //   (Array.isArray(value) &&
  //     value.some((val) => val?.value === this.activeElement?.value));
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attributes } from '../../../types/type';

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.css',
})
export class DemensionsComponent {
  @Input() width!: string;
  @Input() height!: string;

  @Output() handleInputChange = new EventEmitter<
    { property: keyof Attributes | string; value: Event } | Partial<Attributes>
  >();

  @Output() handleBlurInput = new EventEmitter<void>();

  dimensionsOptions = [
    { label: 'W', property: 'width' },
    { label: 'H', property: 'height' },
  ];

  handleInputChangeSize(
    payload:
      | { property: keyof Attributes | string; value: Event }
      | Partial<Attributes>
  ) {
    this.handleInputChange.emit(payload);
  }

  handleBlur() {
    this.handleBlurInput.emit();
  }
}

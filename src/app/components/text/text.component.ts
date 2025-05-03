import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attributes } from '../../../types/type';
import {
  fontFamilyOptions,
  fontSizeOptions,
  fontWeightOptions,
} from '../../../../constants';
import { RenderSelectComponent } from '../render-select/render-select.component';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [RenderSelectComponent],
  templateUrl: './text.component.html',
  styleUrl: './text.component.css',
})
export class TextComponent {
  @Input() fontFamily!: string;
  @Input() fontSize!: string;
  @Input() fontWeight!: string;

  @Output() handleInputChange = new EventEmitter<
    { property: keyof Attributes | string; value: string } | Partial<Attributes>
  >();

  selectConfigs = [
    {
      property: 'fontFamily',
      placeholder: 'Choose a font',
      options: fontFamilyOptions,
    },
    { property: 'fontSize', placeholder: '30', options: fontSizeOptions },
    {
      property: 'fontWeight',
      placeholder: 'Semibold',
      options: fontWeightOptions,
    },
  ];

  handleSelectChange(
    payload:
      | { property: keyof Attributes | string; value: string }
      | Partial<Attributes>
  ) {
    this.handleInputChange.emit(payload);
  }
}

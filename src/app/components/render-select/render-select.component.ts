import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MATERIAL_STANDALONE_MODULES } from '../shared/material-standalone';
import { CommonModule } from '@angular/common';
import { Attributes } from '../../../types/type';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-render-select',
  standalone: true,
  imports: [MATERIAL_STANDALONE_MODULES, CommonModule],
  templateUrl: './render-select.component.html',
  styleUrl: './render-select.component.css',
})
export class RenderSelectComponent {
  @Input() config?: {
    property: string;
    placeholder: string;
    options: { label: string; value: string }[];
  };

  @Input() fontSize!: string;
  @Input() fontFamily!: string;
  @Input() fontWeight!: string;

  @Output() handleSelectChange = new EventEmitter<
    { property: keyof Attributes | string; value: string } | Partial<Attributes>
  >();

  handleChangeValueSelect(property: keyof Attributes | string, value: string) {
    this.handleSelectChange.emit({
      property,
      value,
    });
  }
}

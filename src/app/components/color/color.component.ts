import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Attributes } from '../../../types/type';

@Component({
  selector: 'app-color',
  standalone: true,
  imports: [],
  templateUrl: './color.component.html',
  styleUrl: './color.component.css',
})
export class ColorComponent {
  @Input() attribute!: string;
  @Input() attributeType!: string;
  @Input() placeholder!: string;

  @Output() handleInputChange = new EventEmitter<
    { property: keyof Attributes | string; value: string } | Partial<Attributes>
  >();

  @ViewChild('Input')
  containerInput!: ElementRef<HTMLElement>;

  handleOpenInput() {
    this.containerInput.nativeElement.click();
  }

  handleChangeColor(attrType: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.handleInputChange.emit({ property: attrType, value });
  }
}

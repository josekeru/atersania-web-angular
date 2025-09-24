import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent {
  @Input() title: string = 'Aviso';
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.isVisible = false;
    this.closed.emit();
  }
}

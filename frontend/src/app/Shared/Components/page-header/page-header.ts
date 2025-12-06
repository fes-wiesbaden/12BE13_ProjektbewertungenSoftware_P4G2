import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './page-header.html',
})
export class PageHeaderComponents {
  @Input() title = '';
  @Output() addClick = new EventEmitter<void>();

  @Input() showAddButton = false;
}

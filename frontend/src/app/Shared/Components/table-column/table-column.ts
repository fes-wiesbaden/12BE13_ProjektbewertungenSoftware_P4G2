import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface TableColumn<T> {
  key: keyof T;         
  label: string;        
  type?: 'text' | 'image';
}

@Component({
  selector: 'app-table-column',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './table-column.html'
})
export class TableColumnComponent<T extends { id?: any } = any> {
  @Input() items: T[] = [];
  @Input() columns: TableColumn<T>[] = [];

  @Input() showEditButtons = false;
  @Input() showDeleteButtons = false;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
}
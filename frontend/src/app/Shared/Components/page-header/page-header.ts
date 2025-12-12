import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './page-header.html',
})
export class PageHeaderComponents {
  @Input() title = '';
  @Input() titleAdd = '';
  @Input() filterOptions: { key: string; label: string }[] = [];
  @Input() selectedFilter = '';
  @Input() showImportButton = true;
  @Input() showExportButton = true;

  @Output() addClick = new EventEmitter<void>();
  @Output() importClick = new EventEmitter<void>();
  @Output() exportClick = new EventEmitter<void>();
  @Input() showAddButton = false;

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  filterDropdownOpen = false;

  toggleFilterDropdown() {
    this.filterDropdownOpen = !this.filterDropdownOpen;
  }

  onSearch(event: any) {
    const value = event.target.value;
    this.search.emit(value);
  }

  onFilterChange(filterKey: string) {
    this.selectedFilter = filterKey;
    this.filterDropdownOpen = false;
    this.filterChange.emit(filterKey);
  }
}

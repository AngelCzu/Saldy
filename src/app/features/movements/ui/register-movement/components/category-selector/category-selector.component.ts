import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})
export class CategorySelectorComponent {

  // Inputs
  @Input() categories: Category[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() selectedId = '';
  @Input() invalid = false;
  @Input() columns?: number;

  // Outputs
  @Output() select = new EventEmitter<string>();
  @Output() retry = new EventEmitter<void>();

  // Helpers
  get computedColumns() {
    if (this.columns) return this.columns;

    if (this.loading) return 4;

    const count = this.categories.length;

    if (count <= 4) return count;
    if (count <= 6) return 3;

    return 4;
  }

  get skeletonItems() {
    return Array(8).fill(0);
  }

  onSelect(id: string) {
    this.select.emit(id);
  }

  onRetry() {
    this.retry.emit();
  }
}
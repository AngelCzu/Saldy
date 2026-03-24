import { Injectable, inject } from '@angular/core';
import { ListActiveCategoriesUseCase } from './list-categories.usecase';
import { Category } from 'src/app/domain/entities/category.entity';

@Injectable({ providedIn: 'root' })
export class CategoryCacheService {

  private listCategories = inject(ListActiveCategoriesUseCase);

  private cache: Category[] | null = null;

  async getCategories(): Promise<Category[]> {

    // si ya existe cache → devolverlo
    if (this.cache) {
      return this.cache;
    }

    // si no → ir a Firestore
    const categories = await this.listCategories.execute();

    this.cache = categories;

    return categories;
  }

  // limpiar cache (cuando cambias algo)
  clear() {
    this.cache = null;
  }
}
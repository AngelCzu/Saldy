import { Injectable } from '@angular/core';
import { CategoryRepository } from 'src/app/domain/repositories/category.repository';

@Injectable({ providedIn: 'root' })
export class DeactivateCategoryUseCase {

  constructor(
    private repository: CategoryRepository
  ) {}

  async execute(userId: string, categoryId: string) {

    const categories = await this.repository.getAll(userId);

    const category = categories.find(c => c.getId() === categoryId);

    if (!category) {
      throw new Error('Categoría no encontrada');
    }

    const updated = new Category({
      id: category.getId(),
      name: category.getName(),
      color: category.getColor(),
      isActive: false
    });

    await this.repository.update(userId, updated);
  }

}
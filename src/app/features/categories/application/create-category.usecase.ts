import { Injectable } from '@angular/core';
import { CategoryRepository } from 'src/app/domain/repositories/category.repository';
import { Category } from 'src/app/domain/entities/category.entity';

@Injectable({ providedIn: 'root' })
export class CreateCategoryUseCase {

  constructor(
    private repository: CategoryRepository
  ) {}

  async execute(params: {
    name: string;
    color: string;
    icon: string;
  }) {

    const activeCategories = await this.repository.countActive();

    if (activeCategories >= 7) {
      throw new Error('Máximo 7 categorías activas.');
    }

    const category = new Category({
      id: crypto.randomUUID(),
      name: params.name,
      color: params.color,
      icon: params.icon,
      isActive: true,
      isSystem: false
    });

    await this.repository.create(category);
  }
}
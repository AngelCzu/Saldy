import { Injectable } from '@angular/core';
import { CategoryRepository } from 'src/app/domain/repositories/category.repository';
import { Category } from 'src/app/domain/entities/category.entity';

@Injectable({ providedIn: 'root' })
export class CreateCategoryUseCase {

  constructor(
    private repository: CategoryRepository
  ) {}

  async execute(params: {
    userId: string;
    name: string;
    color: string;
  }) {

    const activeCategories =
      await this.repository.getActive(params.userId);

    if (activeCategories.length >= 7) {
      throw new Error('Máximo 7 categorías activas.');
    }

    const category = new Category({
      id: crypto.randomUUID(),
      name: params.name,
      color: params.color,
      isActive: true
    });

    await this.repository.create(params.userId, category);
  }
}
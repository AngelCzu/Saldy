import { inject, Injectable } from "@angular/core";
import { DEFAULT_CATEGORIES } from "src/app/domain/constants/default-categories";
import { Category } from "src/app/domain/entities/category.entity";
import { CategoryRepository } from "src/app/domain/repositories/category.repository";

@Injectable({ providedIn: 'root' })
export class EnsureUserCategoriesUseCase {

  private repo = inject(CategoryRepository);

  async execute(): Promise<void> {

    const existing = await this.repo.getAll();

    if (existing.length > 0) return;

    for (const cat of DEFAULT_CATEGORIES) {

        const category = new Category({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            icon: cat.icon,
            isActive: true,
            isSystem: true
        });

        await this.repo.create(category);
        }
  }
}
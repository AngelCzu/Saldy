import { Injectable, Inject } from '@angular/core';
import { CategoryRepository } from 'src/app/domain/repositories/category.repository';
import { Category } from 'src/app/domain/entities/category.entity';

@Injectable({ providedIn: 'root' })
export class ListActiveCategoriesUseCase {

  constructor(
    private repository: CategoryRepository
  ) {}

  async execute(userId: string): Promise<Category[]> {
    return this.repository.getActive();
  }

}
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {

  abstract getAll(): Promise<Category[]>;

  abstract getActive(): Promise<Category[]>;

  abstract create(category: Category): Promise<void>;

  abstract update(category: Category): Promise<void>;

}
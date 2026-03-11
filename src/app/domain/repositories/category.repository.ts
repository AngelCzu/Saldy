import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {

  abstract getAll(userId: string): Promise<Category[]>;

  abstract getActive(userId: string): Promise<Category[]>;

  abstract create(userId: string, category: Category): Promise<void>;

  abstract update(userId: string, category: Category): Promise<void>;

}
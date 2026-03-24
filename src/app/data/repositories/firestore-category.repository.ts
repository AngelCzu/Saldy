import { Injectable } from '@angular/core';
import { doc, getDoc, getDocs, setDoc, query, where } from '@angular/fire/firestore';
import { Category } from 'src/app/domain/entities/category.entity';
import { CategoryRepository } from 'src/app/domain/repositories/category.repository';
import { FirestoreDatasource } from '../datasources/firestore.datasource';

interface CategoryDocument {
  nombre: string;
  color: string;
  icon: string;
  activa: boolean;
  isSystem: boolean;
}


@Injectable({ providedIn: 'root' })
export class FirestoreCategoryRepository implements CategoryRepository {
  constructor(private readonly datasource: FirestoreDatasource) {}

  async getAll(): Promise<Category[]> {
    const snapshot = await getDocs(
      this.datasource.userCollection('categorias')
    );

    return snapshot.docs.map(d => this.toEntity(d.id, d.data()));
  }

  async getActive(): Promise<Category[]> {
    const snapshot = await getDocs(
      query(
        this.datasource.userCollection('categorias'),
        where('activa', '==', true)
      )
    );

    return snapshot.docs.map(d => this.toEntity(d.id, d.data()));
  }

  async create(category: Category): Promise<void> {
    const ref = this.datasource.userDoc(`categorias/${category.getId()}`);
    await setDoc(ref, this.toFirestore(category));
  }

  async update(category: Category): Promise<void> {
    const ref = this.datasource.userDoc(`categorias/${category.getId()}`);

    const existing = await getDoc(ref);
    if (!existing.exists()) {
      throw new Error('Categoría no encontrada');
    }

    await setDoc(ref, this.toFirestore(category), { merge: true });
  }

  async countActive(): Promise<number> {
    const snapshot = await getDocs(
      query(
        this.datasource.userCollection('categorias'),
        where('activa', '==', true)
      )
    );

    return snapshot.size;
  }

  private toEntity(id: string, data: any): Category {
    return new Category({
      id,
      name: data.nombre ?? '',
      color: data.color ?? '#6B7280',
      icon: data.icon ?? 'pricetag-outline',
      isActive: data.activa ?? true,
      isSystem: data.isSystem ?? false
    });
  }

  private toFirestore(category: Category) {
    return {
      nombre: category.getName(),
      color: category.getColor(),
      icon: category.getIcon(),
      activa: category.isActiveCategory(),
      isSystem: category.isSystemCategory()
    };
  }
}

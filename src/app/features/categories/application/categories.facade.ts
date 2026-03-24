import { Injectable, inject, signal } from '@angular/core';
import { UiState, initialUiState, setLoading, setData, setError } from 'src/app/core/state/ui-state';

import { CategoryCacheService } from './category-cache.service';
import { EnsureUserCategoriesUseCase } from './ensure-user-categories.usecase';

interface CategoryVM {
  id: string;
  name: string;
  icon: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class CategoriesFacade {

  private cache = inject(CategoryCacheService);
  private ensure = inject(EnsureUserCategoriesUseCase);

  state = signal<UiState<CategoryVM[]>>({
    data: null,
    loading: true, // 👈 aquí sí
    error: null
  });

  async load() {
    this.state.update(setLoading);

    try {
      // MUY IMPORTANTE
      await this.ensure.execute();

      const categories = await this.cache.getCategories();

      const mapped = categories.map(c => ({
        id: c.getId(),
        name: c.getName(),
        icon: c.getIcon(),
        color: c.getColor()
      }));

      this.state.update(state => setData(state, mapped));

    } catch (error) {
      this.state.update(state =>
        setError(state, 'No se pudieron cargar las categorías')
      );
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
export interface UiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const initialUiState = <T>(): UiState<T> => ({
  data: null,
  loading: false,
  error: null
});

export const setLoading = <T>(state: UiState<T>): UiState<T> => ({
  ...state,
  loading: true,
  error: null
});

export const setError = <T>(state: UiState<T>, error: string): UiState<T> => ({
  ...state,
  loading: false,
  error
});

export const setData = <T>(state: UiState<T>, data: T): UiState<T> => ({
  ...state,
  data,
  loading: false,
  error: null
});
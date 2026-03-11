export class Category {

  private readonly id: string;
  private readonly name: string;
  private readonly color: string;
  private readonly isActive: boolean;

  constructor(params: {
    id: string;
    name: string;
    color: string;
    isActive: boolean;
  }) {

    if (!params.name || params.name.trim().length === 0) {
      throw new Error('La categoría debe tener nombre.');
    }

    if (!params.color) {
      throw new Error('La categoría debe tener color.');
    }

    this.id = params.id;
    this.name = params.name;
    this.color = params.color;
    this.isActive = params.isActive;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getColor(): string {
    return this.color;
  }

  isActiveCategory(): boolean {
    return this.isActive;
  }

}
export class Category {

  private readonly id: string;
  private readonly name: string;
  private readonly color: string;
  private readonly icon: string;
  private readonly isActive: boolean;
  private readonly isSystem: boolean;

  constructor(params: {
    id: string;
    name: string;
    color: string;
    icon: string;
    isActive: boolean;
    isSystem: boolean;
  }) {

    if (!params.name || params.name.trim().length === 0) {
      throw new Error('La categoría debe tener nombre.');
    }

    this.id = params.id;
    this.name = params.name;
    this.color = params.color;
    this.icon = params.icon;
    this.isActive = params.isActive;
    this.isSystem = params.isSystem;
  }

  getId() { return this.id; }
  getName() { return this.name; }
  getColor() { return this.color; }
  getIcon() { return this.icon; }
  isActiveCategory() { return this.isActive; }
  isSystemCategory() { return this.isSystem; }
}
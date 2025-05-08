import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { Product } from '../model/product.model';
import { Category } from '../model/category.model';
import { ProductService } from '../service/product.service';

@Component({
  standalone: true,
  selector: 'app-create-product-dialog',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    InputNumberModule,
    DropdownModule
  ],
  template: `
    <p-dialog
      header="Novo Produto"
      [(visible)]="visible"
      [modal]="true"
      [closable]="false"
      styleClass="w-96"
    >
      <div class="flex flex-column gap-3">
        <div class="field">
          <label for="productName">Nome:</label>
          <input
            id="productName"
            type="text"
            pInputText
            [(ngModel)]="newProduct.name"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="productPrice">Preço:</label>
          <p-inputNumber
            id="productPrice"
            [(ngModel)]="newProduct.price"
            mode="currency"
            currency="BRL"
            locale="pt-BR"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="productCategory">Categoria:</label>
          <p-dropdown
            id="productCategory"
            [options]="categories"
            [(ngModel)]="selectedCategory"
            optionLabel="name"
            (onChange)="onCategoryChange($event)"
            class="w-full"
            placeholder="Selecione uma categoria"
          />
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          icon="pi pi-times"
          (click)="cancel()"
          class="p-button-text"
        />
        <p-button
          label="Criar"
          icon="pi pi-check"
          (click)="handleConfirmCreate()"
        />
      </ng-template>
    </p-dialog>
  `
})
export class CreateProductDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmCreate = new EventEmitter<Product>();

  newProduct: Product = {
    id: undefined,
    name: '',
    price: 0,
    category: { id: 0, name: '' }
  };

  categories: Category[] = [];
  selectedCategory: Category | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  onCategoryChange(event: any) {
    this.newProduct.category = event.value;
  }

  cancel() {
    this.resetForm();
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  handleConfirmCreate() {
    if (this.isFormValid()) {
      this.confirmCreate.emit(this.newProduct);
      this.resetForm();
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.newProduct.name &&
      this.newProduct.price >= 0 &&
      this.newProduct.category &&
      this.newProduct.category.id
    );
  }

  private resetForm() {
    this.newProduct = {
      id: undefined,
      name: '',
      price: 0,
      category: { id: 0, name: '' }
    };
    this.selectedCategory = null;
  }
}

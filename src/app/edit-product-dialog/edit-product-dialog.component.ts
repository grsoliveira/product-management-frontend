import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { Product } from '../model/product.model';
import { Category } from '../model/category.model';
import { ProductService } from '../service/product.service';

@Component({
  standalone: true,
  selector: 'app-edit-product-dialog',
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
      header="Editar Produto"
      [(visible)]="visible"
      [modal]="true"
      [closable]="false"
      styleClass="w-96"
    >
      <div *ngIf="product" class="flex flex-column gap-3">
        <div class="field">
          <label for="productName">Nome:</label>
          <input
            id="productName"
            type="text"
            pInputText
            [(ngModel)]="editableProduct.name"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="productPrice">Preço:</label>
          <p-inputNumber
            id="productPrice"
            [(ngModel)]="editableProduct.price"
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
          label="Salvar"
          icon="pi pi-check"
          (click)="handleConfirmEdit()"
        />
      </ng-template>
    </p-dialog>
  `
})
export class EditProductDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() product: Product | null = null;
  @Output() confirmEdit = new EventEmitter<Product>();

  editableProduct: Product = {
    id: undefined,
    name: '',
    description: '',
    amount: 0,
    price: 0,
    category: { id: 0, name: '', path: '' }
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

  ngOnChanges() {
    if (this.product) {
      this.editableProduct = {
        ...this.product,
        category: { ...this.product.category }
      };
      this.selectedCategory = this.editableProduct.category;
    }
  }

  onCategoryChange(event: any) {
    this.editableProduct.category = event.value;
  }

  cancel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  handleConfirmEdit() {
    if (this.editableProduct.name &&
      this.editableProduct.price >= 0 &&
      this.editableProduct.category) {
      this.confirmEdit.emit(this.editableProduct);
      this.visible = false;
      this.visibleChange.emit(this.visible);
    }
  }
}

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
import {Textarea} from 'primeng/textarea';

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
    DropdownModule,
    Textarea
  ],
  template: `
    <p-dialog
      header="New Product"
      [(visible)]="visible"
      [modal]="true"
      [closable]="false"
      styleClass="w-96"
    >
      <div class="flex flex-column gap-3">
        <div class="field">
          <label for="productCategory">Category:</label>
          <p-dropdown
            id="productCategory"
            [options]="categories"
            [(ngModel)]="selectedCategory"
            optionLabel="name"
            (onChange)="onCategoryChange($event)"
            class="w-full"
            placeholder="Select a category"
          />
        </div>

        <div class="field">
          <label for="productName">Name:</label>
          <input
            id="productName"
            type="text"
            pInputText
            [(ngModel)]="newProduct.name"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="productDescription">Description:</label>
          <textarea
            id="productDescription"
            type="text"
            pInputTextarea
            [(ngModel)]="newProduct.description"
            rows="4"
            class="w-full"
          ></textarea>
        </div>

        <div class="field">
          <label for="productAmount">Amount:</label>
          <p-inputNumber
            [(ngModel)]="newProduct.amount"
            [useGrouping]="false"
            [minFractionDigits]="0"
            [maxFractionDigits]="0"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="productPrice">Price:</label>
          <p-inputNumber
            id="productPrice"
            [(ngModel)]="newProduct.price"
            mode="currency"
            currency="BRL"
            locale="pt-BR"
            class="w-full"
          />
        </div>

      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancel"
          icon="pi pi-times"
          (click)="cancel()"
          class="p-button-text"
        />
        <p-button
          label="Create"
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
        console.error('Error on loading categories:', error);
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
      description: '',
      amount: 0,
      price: 0,
      category: { id: 0, name: '', path: '' }
    };
    this.selectedCategory = null;
  }
}

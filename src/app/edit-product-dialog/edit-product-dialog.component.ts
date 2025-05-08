import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InputNumberModule} from 'primeng/inputnumber';
import {DropdownModule} from 'primeng/dropdown';
import {Product} from '../model/product.model';
import {Category} from '../model/category.model';
import {ProductService} from '../service/product.service';
import {Textarea} from 'primeng/textarea';

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
    DropdownModule,
    Textarea
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
            [(ngModel)]="editableProduct.name"
            class="w-full"
          />
        </div>

        <div class="field">
          <label for="productDescription">Description:</label>
          <textarea
            id="productDescription"
            type="text"
            pInputTextarea
            [(ngModel)]="editableProduct.description"
            rows="4"
            class="w-full"
          ></textarea>
        </div>

        <div class="field">
          <label for="productAmount">Amount:</label>
          <p-inputNumber
            [(ngModel)]="editableProduct.amount"
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
            [(ngModel)]="editableProduct.price"
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
          label="Save"
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
    category: {id: 0, name: '', path: ''}
  };

  categories: Category[] = [];
  selectedCategory: Category | null = null;

  constructor(private productService: ProductService) {
  }

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

  ngOnChanges() {
    if (this.product) {
      this.editableProduct = {
        ...this.product,
        category: {...this.product.category}
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

import {Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Product, Category, ProductService} from '../services/product.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-product-edit-dialog',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './product-edit-dialog.component.html'
})
export class ProductEditDialogComponent implements OnInit{
  @Input() product!: Product;
  productForm: FormGroup;
  categories: Category[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      price: [this.product?.price || 0, [Validators.required, Validators.min(0.01)]],
      category: [this.product?.category?.id || null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm = this.fb.group({
        name: [this.product.name, Validators.required],
        price: [this.product.price, [Validators.required, Validators.min(0.01)]],
        category: [this.product.category?.id || null, Validators.required]
      });

      this.loadCategories();
    }
  }

  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Erro ao carregar categorias', err)
    });
  }

  save(): void {
    if (this.productForm.valid) {
      const updatedProduct = { ...this.product, ...this.productForm.value };
      this.productService.updateProduct(updatedProduct).subscribe({
        next: () => this.activeModal.close('refresh'),
        error: (err: any) => console.error('Erro ao atualizar produto', err)
      });
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}

import {Component, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Category, ProductService} from '../services/product.service';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-product-add-dialog',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './product-add-dialog.component.html'
})
export class ProductAddDialogComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
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
      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => this.activeModal.close('refresh'),
        error: (err: any) => console.error('Erro ao salvar', err)
      });
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-add-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './product-add-dialog.component.html'
})
export class ProductAddDialogComponent {
  productForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]]
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

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CurrencyPipe, NgForOf} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductAddDialogComponent} from '../../product-add-dialog/product-add-dialog.component';
import {Product, ProductService} from '../../services/product.service';
import {ProductDeleteConfirmationComponent} from "../../product-remove-dialog/product-delete-confirmation.component";

@Component({
  selector: 'app-product-list',
  imports: [
    CurrencyPipe,
    NgForOf
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string | null = null;

  constructor(private http: HttpClient,
              private productService: ProductService,
              private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.errorMessage = 'Erro ao carregar produtos.';
      }
    });
  }

  openAddProductDialog(): void {
    const modalRef = this.modalService.open(ProductAddDialogComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.result.then((result) => {
      if (result === 'refresh') {
        this.loadProducts();
      }
    }, () => {});
  }

  openDeleteConfirmationDialog(product: Product): void {
    const modalRef = this.modalService.open(ProductDeleteConfirmationComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.product = product;  // Passando o produto para o modal

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        if (result === 'confirm' && product.id !== undefined) {
          this.deleteProduct(product.id);
        }
      }
    }, () => {});
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        this.loadProducts();
      }
    });
  }
}

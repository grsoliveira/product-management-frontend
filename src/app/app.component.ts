import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { TableModule } from 'primeng/table';
import { Product } from './model/product.model';
import { ProductService } from './service/product.service';
import { Button } from 'primeng/button';
import { DeleteProductDialogComponent } from './delete-product-dialog/delete-product-dialog.component';
import { EditProductDialogComponent } from './edit-product-dialog/edit-product-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import {CreateProductDialogComponent} from './create-product-dialog/create-product-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TableModule,
    Button,
    DeleteProductDialogComponent,
    EditProductDialogComponent,
    CurrencyPipe,
    ToastModule,
    CreateProductDialogComponent
  ],
  providers: [MessageService], // Adiciona o MessageService ao componente
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title(title: any) {
      throw new Error('Method not implemented.');
  }
  products: Product[] = [];
  selectedProduct: Product | null = null; // Corrigido o tipo para Product
  deleteDialogVisible = false;
  editDialogVisible = false;
  createDialogVisible = false;

  constructor(
    private primeng: PrimeNG,
    private service: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.loadProducts();
  }

  // Método para carregar produtos
  loadProducts() {
    this.service.getAll().subscribe((data) => {
      this.products = data;
    });
  }

  openDialogToDelete(product: Product) { // Corrigido o tipo para Product
    this.selectedProduct = product;
    this.deleteDialogVisible = true;
  }

  openDialogToEdit(product: Product) { // Corrigido o tipo para Product
    this.selectedProduct = product;
    this.editDialogVisible = true;
  }

  openDialogToCreate() { // Corrigido o tipo para Product
    this.createDialogVisible = true;
  }

  deleteProduct(id: number) {
    this.service.deleteProduct(id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.deleteDialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto excluído com sucesso!',
            life: 3000
          });
          this.loadProducts();
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = null;

        switch (error.status) {
          case 404:
            errorMessage = 'Produto não encontrado';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para excluir este produto';
            break;
          case 400:
            errorMessage = 'Requisição inválida';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
        }

        if (errorMessage !== null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
            life: 5000,
            icon: 'pi pi-exclamation-triangle'
          });
        }

      }
    });
  }

  updateProduct(updated: Product) {
    this.service.updateProduct(updated).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.editDialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto atualizado com sucesso!',
            life: 3000
          });
          this.loadProducts();
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao atualizar produto';

        switch (error.status) {
          case 404:
            errorMessage = 'Produto não encontrado';
            break;
          case 403:
            errorMessage = 'Você não tem permissão para atualizar este produto';
            break;
          case 400:
            errorMessage = 'Dados do produto inválidos';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          case 409:
            errorMessage = 'Conflito ao atualizar o produto';
            break;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage,
          life: 5000,
          icon: 'pi pi-exclamation-triangle'
        });
      }
    });
  }

  // No app.component.ts, adicione o método createProduct
  createProduct(product: Product) {
    this.service.createProduct(product).subscribe({
      next: (response) => {
        this.createDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto criado com sucesso!',
          life: 3000
        });
        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = 'Erro ao criar produto';

        switch (error.status) {
          case 403:
            errorMessage = 'Você não tem permissão para criar produtos';
            break;
          case 400:
            errorMessage = 'Dados do produto inválidos';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor';
            break;
          case 409:
            errorMessage = 'Já existe um produto com este nome';
            break;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage,
          life: 5000,
          icon: 'pi pi-exclamation-triangle'
        });
      }
    });
  }
}

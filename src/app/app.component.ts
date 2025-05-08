import {Component, OnInit} from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {TableModule} from 'primeng/table';
import {Product} from './model/product.model';
import {ProductService} from './service/product.service';
import {Button} from 'primeng/button';
import {DeleteProductDialogComponent} from './delete-product-dialog/delete-product-dialog.component';
import {EditProductDialogComponent} from './edit-product-dialog/edit-product-dialog.component';
import {CurrencyPipe, NgIf} from '@angular/common';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {CreateProductDialogComponent} from './create-product-dialog/create-product-dialog.component';
import {ProductToList} from './model/product-to-list.model';
import {APP_MESSAGES} from './core/constants/messages.constants';
import {AuthService} from './service/AuthService';
import {ConfirmDialog} from 'primeng/confirmdialog';

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
    CreateProductDialogComponent,
    NgIf,
    ConfirmDialog
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  private readonly messages = APP_MESSAGES;

  products: ProductToList[] = [];
  selectedProduct: Product | null = null;
  deleteDialogVisible = false;
  editDialogVisible = false;
  createDialogVisible = false;

  constructor(
    private primeng: PrimeNG,
    private service: ProductService,
    private messageService: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.loadProducts();
  }

  loadProducts() {
    this.service.getAll().subscribe((data) => {
      this.products = data;
    });
  }

  openDialogToDelete(productId: number) {
    this.service.getById(productId).subscribe((data) => {
      this.selectedProduct = data.body;
      this.deleteDialogVisible = true;
    });
  }

  openDialogToEdit(productId: number) {
    this.service.getById(productId).subscribe((data) => {
      this.selectedProduct = data.body;
      this.editDialogVisible = true;
    });
  }

  openDialogToCreate() {
    this.createDialogVisible = true;
  }

  deleteProduct(id: number) {
    this.service.deleteProduct(id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.deleteDialogVisible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.messages.success.deleted,
            life: 3000
          });
          this.loadProducts();
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = this.messages.error.delete.default;

        switch (error.status) {
          case 404:
            errorMessage = this.messages.error.delete.notFound;
            break;
          case 403:
            errorMessage = this.messages.error.delete.forbidden;
            break;
          case 500:
            errorMessage = this.messages.error.delete.server;
            break;
          case 409:
            errorMessage = this.messages.error.delete.conflict;
            break;
        }

        if (errorMessage !== null) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
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
            summary: 'Success',
            detail: this.messages.success.updated,
            life: 3000
          });
          this.loadProducts();
        }
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = this.messages.error.update.default;

        switch (error.status) {
          case 404:
            errorMessage = this.messages.error.update.notFound;
            break;
          case 403:
            errorMessage = this.messages.error.update.forbidden;
            break;
          case 400:
            errorMessage = this.messages.error.update.invalidData;
            break;
          case 500:
            errorMessage = this.messages.error.update.server;
            break;
          case 409:
            errorMessage = this.messages.error.update.conflict;
            break;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000,
          icon: 'pi pi-exclamation-triangle'
        });
      }
    });
  }

  createProduct(product: Product) {
    this.service.createProduct(product).subscribe({
      next: (response) => {
        this.createDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.messages.success.created,
          life: 3000
        });
        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        let errorMessage = this.messages.error.create.default;

        switch (error.status) {
          case 403:
            errorMessage = this.messages.error.create.forbidden;
            break;
          case 400:
            errorMessage = this.messages.error.create.invalidData;
            break;
          case 500:
            errorMessage = this.messages.error.create.server;
            break;
          case 409:
            errorMessage = this.messages.error.create.conflict;
            break;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000,
          icon: 'pi pi-exclamation-triangle'
        });
      }
    });
  }

  logout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = [];
        this.messageService.add({
          severity: 'info',
          summary: 'Logout',
          detail: 'Successfully logged out',
          life: 3000
        });
        this.authService.logout();
      }
    });
  }


}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Product } from '../model/product.model';

@Component({
  standalone: true,
  selector: 'app-delete-product-dialog',
  template: `
    <p-dialog
      header="Confirmação de Remoção"
      [(visible)]="visible"
      [modal]="true"
      [closable]="false"
      [style]="{ width: '30vw' }"
    >
      <p>Tem certeza que deseja remover <strong>{{ product?.name }}</strong>?</p>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar"
                  class="p-button-text"
                  (click)="cancel()"/>
        <p-button label="Remover"
                  class="p-button-danger"
                  (click)="confirm()"/>
      </ng-template>
    </p-dialog>
  `,
  imports: [CommonModule, DialogModule, ButtonModule]
})
export class DeleteProductDialogComponent {
  @Input() visible = false;
  @Input() product: Product | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmDelete = new EventEmitter<number>();

  cancel() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  confirm() {
    if (this.product?.id) {
      this.confirmDelete.emit(this.product.id);
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}

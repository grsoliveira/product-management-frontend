import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-delete-confirmation',
  templateUrl: './product-delete-confirmation.component.html'
})
export class ProductDeleteConfirmationComponent {
  @Input() product: any;

  constructor(public activeModal: NgbActiveModal) {}

  confirmDeletion(): void {
    this.activeModal.close('confirm');
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}

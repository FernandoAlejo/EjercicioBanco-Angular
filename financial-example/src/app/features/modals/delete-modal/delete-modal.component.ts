import { Component, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  isOpen = false;
  productToDelete: any;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modalState$.subscribe(state => this.isOpen = state);
    this.modalService.productToDelete$.subscribe(product => this.productToDelete = product);
  }

  onCancel() {
    this.modalService.closeModal();
  }

  onDelete() {
    console.log('Deleting product:', this.productToDelete);
    this.modalService.closeModal();
  }
}

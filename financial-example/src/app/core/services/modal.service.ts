import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../models/product.model';
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  private modalStateSubject = new Subject<boolean>();
  modalState$ = this.modalStateSubject.asObservable();

  private productToDeleteSubject = new Subject<any>();
  productToDelete$ = this.productToDeleteSubject.asObservable();

  openModal(product: Product) {
    this.productToDeleteSubject.next(product);
    this.modalStateSubject.next(true);
  }

  closeModal() {
    this.modalStateSubject.next(false);
  }
}

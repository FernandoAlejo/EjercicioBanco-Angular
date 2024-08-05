import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,AsyncValidator, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductsService } from 'src/app/core/services/products.service';
import { Observable, Subject, of } from 'rxjs';
import { map, catchError, takeUntil, finalize, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  product: any;
  submitResult$!: Observable<any>;
  isSubmitting = false;
  private destroy$ = new Subject<void>();
  productId: string | null = null;
  

  constructor(private fb: FormBuilder, private productsService: ProductsService, private router: Router,
    private routeParam: ActivatedRoute) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idValidator.bind(this)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
    this.productForm.reset();
  }

  ngOnInit() {
    this.initForm();
    this.isEditMode = false;
    this.productsService.currentProduct.subscribe(product => {
      if (product) {
        console.log('si')
        this.isEditMode = true;
        this.productForm.patchValue(product);
      } else {
        console.log('no')
        this.isEditMode = false;
        this.productForm.reset(); // Limpiar el formulario si no hay producto
      }
    });
  }
  initForm() {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idValidator.bind(this)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
  }

  idValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!this.isEditMode) {
      return this.productsService.verifyId(control.value).pipe(
        map(isIdTaken => isIdTaken ? { idTaken: true } : null),
        catchError(() => of(null))
      );
    } else {
      return of(null);
    }
  }

  dateReleaseValidator(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    return inputDate >= currentDate ? null : { dateReleaseInvalid: true };
  }

  dateRevisionValidator(control: AbstractControl): ValidationErrors | null {
    const releaseDate = new Date(this.productForm.get('date_release')?.value);
    const revisionDate = new Date(control.value);
    const oneYearLater = new Date(releaseDate.getFullYear() + 1, releaseDate.getMonth(), releaseDate.getDate());
    return revisionDate.getTime() === oneYearLater.getTime() ? null : { dateRevisionInvalid: true };
  }

  onSubmit() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const productData: Product = this.productForm.value;
      console.log('Datos del producto a crear:', productData);
      if(this.isEditMode){
        console.log('edita')
        this.submitResult$ = this.productsService.updateProduct(productData).pipe(
          tap(response => {
            console.log('Respuesta del servidor:', response);
            this.router.navigate(['']);
          }),
          map(response => ({
            success: true,
            message: 'Producto editado exitosamente',
            data: response
          })),
          catchError(error => {
            console.error('Error al editar el producto:', error);
            return of({
              success: false,
              message: 'Error al editar el producto',
              error: error
            });
          }),
          finalize(() => {
            this.isSubmitting = false;
          }),
          takeUntil(this.destroy$)
        );
        this.submitResult$.subscribe(
          result => {
            if (result.success) {
              console.log('Producto editado con éxito:', result.data);
            } else {
              console.error('Error al editar el producto:', result.error);
            }
          }
        );
      }
      else{
        console.log('no edita')
      this.submitResult$ = this.productsService.createProduct(productData).pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
          this.router.navigate(['']);
        }),
        map(response => ({
          success: true,
          message: 'Producto creado exitosamente',
          data: response
        })),
        catchError(error => {
          console.error('Error al crear el producto:', error);
          return of({
            success: false,
            message: 'Error al crear el producto',
            error: error
          });
        }),
        finalize(() => {
          this.isSubmitting = false;
        }),
        takeUntil(this.destroy$)
      );
      this.submitResult$.subscribe(
        result => {
          if (result.success) {
            console.log('Producto creado con éxito:', result.data);
          } else {
            console.error('Error al crear el producto:', result.error);
          }
        }
      );
      }
    }
  }

  onReset() {
    this.productForm.reset();
  }
  onQuit() {
    this.productForm.reset();
    this.productsService.changeProduct(null);
    this.router.navigate(['']);
  }
}


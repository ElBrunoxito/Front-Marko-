import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { ProductGetUserDTO } from '../../../models/Products';
import { BrowserModule } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { OperationsFrontService } from '../../../service/operations-front.service';
import { ProductService } from '../../../service/product.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-select-product-w',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    NgIf

  ],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectProductWComponent),
      multi: true
    }
  ],
  templateUrl: './select-product-w.component.html',
  styleUrl: './select-product-w.component.scss'
})
export class SelectProductWComponent implements OnInit,OnChanges {





  @Input() products: ProductGetUserDTO[] = []; // Lista de productos
  @Input() initialBarCode: string = ''; // BarCode inicial
  @Input() invalid:boolean = false;
  @Output() productSelected = new EventEmitter<ProductGetUserDTO>();

  searchTerm: string = ''; // El valor de búsqueda
  filteredProducts: any[] = []; // Productos filtrados
  isDropdownOpen: boolean = false; // Controla el despliegue del dropdown
  activeIndex: number = -1; // Índice del producto activo en el dropdown
  selectedProduct: ProductGetUserDTO | null = null; // Producto seleccionado actualmente

  private pendingValue: UUID | null = null; 

  private onChange: (value: UUID | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    // Mostrar todos los productos al inicio y abrir el dropdown
    this.filteredProducts = this.products;
    this.isDropdownOpen = true;


    // Autocompletar si se recibe un barCode inicial
    if (this.initialBarCode) {
      
      setTimeout(() => {
        this.autocompleteByBarCode(this.initialBarCode);      
        //this.searchTerm = this.initialBarCode
        //this.isDropdownOpen = true
      },200)
    }
    
  }
  
  autocompleteByBarCode(barCode: string) {
    const foundProduct = this.products.find(product => product.barCode === barCode);
    if (foundProduct) {
      this.selectProduct(foundProduct, false);
      this.onChange(foundProduct.idProduct);
      this.isDropdownOpen = true;
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && this.products.length > 0 && this.pendingValue !== null) {
      // Los productos están listos, procesamos el valor pendiente
      this.writeValue(this.pendingValue);
      this.pendingValue = null; // Limpiamos el valor pendiente
      this.isDropdownOpen = true;

    }
  }

  // ControlValueAccessor Methods
  writeValue(value: UUID): void {

    if (this.products.length === 0) {
      // Si los productos aún no están cargados, almacenamos el valor para luego
      this.pendingValue = value;
      return;
    }
    
    if (value) {
      const foundProduct = this.products.find(product => product.idProduct === value);
      if (foundProduct) {
        this.selectProduct(foundProduct, false); // Seleccionar sin cerrar el menú
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Filtrar productos según el término de búsqueda
  onInputChange() {
  if (this.searchTerm) {
    this.filteredProducts = this.products.filter(product =>
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.barCode.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Abrir el menú si hay coincidencias
    this.isDropdownOpen = this.filteredProducts.length > 0; 
  } else {
    this.filteredProducts = this.products; // Mostrar todos los productos si no hay búsqueda
    this.isDropdownOpen = true; // Abrir el menú
  }
  }

  // Seleccionar producto al hacer clic o presionar Enter
  selectProduct(product: any, emitChange = true) {

    this.selectedProduct = product; // Guardar el producto seleccionado
    this.searchTerm = `${product.barCode} - ${product.description}`; // Mostrar barCode y descripción

    // Emitir el cambio al control
    if (emitChange) {
        this.onChange(product.idProduct); // Asignar el idProduct al formControlName
        this.productSelected.emit(product); // Emitir el producto seleccionado
    }

    // Forzar la actualización de la vista
    this.cdRef.detectChanges();

    // Cerrar el menú
    this.isDropdownOpen = false;
  }

  // Autocompletar por barCode


  // Navegar con las flechas del teclado
  navigate(direction: number) {
    if (this.filteredProducts.length > 0) {
      this.activeIndex = (this.activeIndex + direction + this.filteredProducts.length) % this.filteredProducts.length;
    }
  }

  // Seleccionar el producto activo al presionar Enter
  selectActiveProduct() {
    if (this.activeIndex >= 0 && this.activeIndex < this.filteredProducts.length) {
      this.selectProduct(this.filteredProducts[this.activeIndex]);
    }
  }


  // Método para agregar un nuevo producto cuando no se encuentra en la lista
  addProduct() {
    alert('Agregar producto');
  }

  // Abrir o cerrar el dropdown manualmente
  toggleDropdown(state: boolean) {
    this.isDropdownOpen = state;
  }

  // Evitar cierre automático si no se selecciona algo válido
  onBlur() {
    setTimeout(() => {

 
   


      const matchedProducts = this.products.filter(producto =>
        (`${producto.barCode} - ${producto.description}`).startsWith(this.searchTerm)
      );

      if (this.invalid && !this.searchTerm) {
        this.searchTerm = ''
        return;
      }
      
      if (matchedProducts.length > 0) {
        const selectedProduct = matchedProducts[0];
        this.searchTerm = (`${selectedProduct.barCode} - ${selectedProduct.description}`);
        this.onChange(selectedProduct.idProduct)
        this.writeValue(selectedProduct.idProduct)
        return;
      }else{
        this.selectedProduct = null
      }
  
      if (!this.isValidProduct()) {
        this.isDropdownOpen = true; // Mantener el menú abierto si no se seleccionó algo válido
      } else {
        this.isDropdownOpen = false; // Cerrar el menú si se seleccionó algo válido
      }

      
    }, 200);
  }

  // Validar si el producto seleccionado es válido
  isValidProduct(): boolean {
    const selectedProduct = this.products.find(
      product => product.barCode === this.searchTerm.split(' - ')[0]
    );
    return selectedProduct?true:false;
  }


  selectAllText(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }




  



/*  
  @Input() productos: ProductGetUserDTO[] = [];
  filteredOptions!: Observable<ProductGetUserDTO[]>;
  @Input() edit:boolean =  false;

  @Input() invalid: boolean = false;


  control = new FormControl();
  selectedProductId: UUID | null = null;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: UUID | null): void {
    this.selectedProductId = value;
    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(value => {
      // Busca el producto en base al input y establece el ID correspondiente
      const matchedProduct = this.productos.find(product =>
        this.getProductLabel(product.idProduct) === value
      );
      this.selectedProductId = matchedProduct ? matchedProduct.idProduct : null;
      this.onChange(this.selectedProductId); // Notifica el cambio de ID
    });
  }

  registerFirstEdit(id:any):void{
    this.onChange = id;
    this.control.valueChanges.subscribe(value => {
      console.warn("Gaaaa"  + value)
      // Busca el producto en base al input y establece el ID correspondiente
      const matchedProduct = this.productos.find(product =>
        //this.getProductLabel(product.idProduct) === value
        product.idProduct === value
      );
      this.selectedProductId = matchedProduct ? matchedProduct.idProduct : null;
      this.control.setValue(`${matchedProduct?.barCode} - ${matchedProduct?.description}`);
      this.onChange(this.selectedProductId); // Notifica el cambio de ID
    });

  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
  getProductLabel(id: UUID): string {
    const product = this.productos.find(p => p.idProduct === id);
    return product ? `${product.barCode} - ${product.description}` : '';
  }














  constructor(
    private helping: OperationsFrontService,
  ) {}

  onIdChange(newId: number) {
    if(!this.edit) return;
    const selectedOption = this.productos.find(option => option.idProduct === newId);
    if (selectedOption) {
      this.control.setValue(selectedOption.description)
    } else {
      this.control.setValue('');
    }
  }


  ngOnInit() {
    this.configProducts();

    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );



    // Manejo de cambios en el valor del control
    this.control.valueChanges.subscribe(value => {
      const trimmedValue = value?.trim() || '';

      // Si el campo está vacío, limpiar el ID seleccionado
      if (trimmedValue === '') {
        this.selectedProductId = null; // Resetea el ID seleccionado
        return;
      }

      // Buscar coincidencias exactas
      const matchedProduct = this.productos.find(product =>
        `${product.barCode} - ${product.description}` === trimmedValue
      );

      // Si hay una coincidencia exacta
      if (matchedProduct) {
        this.selectedProductId = matchedProduct.idProduct; // Guardar el ID del producto seleccionado
      }
    });





  }

  configProducts() {
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
  }

  private _filter(value: string): ProductGetUserDTO[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => 
      `${option.barCode} - ${option.description}`.toLowerCase().includes(filterValue)
    );
  }


  selectAllText(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.select();
  }


  onBlur() {
    const inputValue = this.control.value;

    // Verificar si el campo está vacío antes de continuar

    if (this.invalid && !inputValue) {
      this.control.setValue('');
      return;
    }


    const matchedProducts = this.productos.filter(producto =>
      (`${producto.barCode} - ${producto.description}`).startsWith(inputValue)
    );

    const selectedProduct = this.productos.find(producto =>
      (producto.barCode + ' - ' + producto.description) === inputValue
    );





    // Si hay coincidencias, selecciona el primero
    
    if (matchedProducts.length > 0) {
      const selectedProduct = matchedProducts[0];
      this.selectedProductId = selectedProduct.idProduct; // Establece el ID del producto seleccionado
      this.control.setValue(`${selectedProduct.barCode} - ${selectedProduct.description}`);
      console.error(this.selectedProductId = selectedProduct.idProduct)
      return;
    }

    if(!selectedProduct){
      this.control.setValue(''); // Dejar vacío si no hay coincidencia
      return;
    }
  
    // Si se encuentra el producto, establece el valor en el campo
    if (selectedProduct) {
      this.control.setValue(`${selectedProduct.barCode} - ${selectedProduct.description}`);
      return
    }
    

    else {
      // Si no hay coincidencias, vacía el campo
      console.warn("No se encontró el producto para el código de barras: " + inputValue);
      this.control.setValue(''); // Dejar vacío si no hay coincidencia
      this.selectedProductId = null; // Resetea el ID seleccionado
      return
    }
    
  

    
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedId = event.option.value; 
    this.selectedProductId = selectedId; // Guarda el ID seleccionado
    // Establece el valor del control como el ID
    this.control.setValue(selectedId);
  
    // Opcional: Encuentra el producto completo si necesitas otros datos
    const selectedProduct = this.productos.find(product => product.idProduct === selectedId);
    if (selectedProduct) {
      this.control.setValue(`${selectedProduct.barCode} - ${selectedProduct.description}`, { emitEvent: false });
    }

  }

 */







}

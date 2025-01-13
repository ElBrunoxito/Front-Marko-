import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TypeComprobanteGetDTO } from '../../../models/TypeComprobante';
import { TypeComprobanteService } from '../../../service/type-comprobante.service';
import { OperationsFrontService } from '../../../service/operations-front.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TypePaymentService } from '../../../service/type-payment.service';
import { BehaviorSubject } from 'rxjs';
import { GetTypePayment } from '../../../models/TypePayment';

@Component({
    selector: 'app-selector',
    imports: [
        FormsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        NgClass,
        NgFor
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectorComponent),
            multi: true
        }
    ],
    templateUrl: './selector.component.html',
    styleUrl: './selector.component.scss'
})
export class SelectorComponent implements OnInit, OnChanges {
  @Input() invalid: boolean = false; // Para manejar la validación
  @Input() noHa:boolean = false;
  @Input() type:number = 0;
  @Input() list:(TypeComprobanteGetDTO | GetTypePayment)[] = []

  selectedValue! : (TypeComprobanteGetDTO | GetTypePayment);
  private selectedValueSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(
    private helping: OperationsFrontService,
    private cdr: ChangeDetectorRef // Inyección de ChangeDetectorRef
  ) {
    
  }


  
  ngOnInit(): void {

    if(this.type === 0){
     // this.getAll()

    }else{
      this.type === 1;
    }
    
    /*setInterval(()=>{
      //this.selectedValue = this.isTypeComprobante(this.list[0])? this.list[0].idTypeComprobante: (this.list[0] as GetTypePayment).idTypePayment;

      console.log((this.isTypeComprobante(this.list[0])? this.list[0].idTypeComprobante: (this.list[0] as GetTypePayment).idTypePayment) + "jajaja")

    },1000)*/

    //this.setIntervalGo()


    //this.setDefaultSelectedValue()

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list'] || changes['selectedValue']) {
      this.setDefaultSelectedValue();
    }
  }
  setDefaultSelectedValue(): void {
    if (!this.selectedValue && this.list.length > 0) {
      //this.selectedValue = this.isTypeComprobante(this.list[0])? this.list[0].idTypeComprobante: (this.list[0] as GetTypePayment).idTypePayment;

     // this.selectedValue = this.list[0]
      this.onChange(this.isTypeComprobante(this.list[0])? this.list[0].idTypeComprobante: (this.list[0] as GetTypePayment).idTypePayment);
      this.cdr.markForCheck(); // Marcamos para detectar cambios de manera segura

    }
  }

/*
  private intervalId: any;

  setIntervalGo(){

    //this.intervalId = setInterval(() => {
      this.selectedValueSubject.subscribe(value => {
        if (value !== null && value !== this.selectedValue) {
          this.selectedValue = value;
          //this.onChange(this.selectedValue); // Notificar el cambio
          this.cdr.detectChanges();

          clearInterval(this.intervalId);
        }
      });
    //}, 200);

  }*/



  // Métodos de ControlValueAccessor
  onChange = (value: any) => {};
  onTouched = () => {};


  writeValue(value: any): void {
    // if (this.list.length > 0 && value !== this.selectedValue) {
    //   this.selectedValueSubject.next(value); // Emitir el nuevo valo
    //   this.setIntervalGo()
    // } 
    this.selectedValue = value; // Si la lista está vacía, solo establece el valor
    this.selectedValueSubject.next(value);
    this.cdr.detectChanges();

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Método que se ejecuta cuando cambia el valor
  selectChange(event: any) {
    this.selectedValue = event.target.value;
    this.onChange(this.selectedValue); // Notifica el cambio
    this.onTouched(); // Marca el input como tocado
  }

  isTypeComprobante(item: any): item is TypeComprobanteGetDTO {
    let sa = 'idTypeComprobante' in item && 'name' in item;
    //console.log(sa + "akajja")
    return sa
  }


}

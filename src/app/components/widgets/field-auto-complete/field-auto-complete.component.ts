import { AsyncPipe, NgClass } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, Observable, of, startWith } from 'rxjs';



@Component({
  selector: 'app-field-auto-complete',
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule, 
    ReactiveFormsModule, 
    AsyncPipe,
    NgClass
  ],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FieldAutoCompleteComponent),
      multi: true
    }
  ],
  templateUrl: './field-auto-complete.component.html',
  styleUrl: './field-auto-complete.component.scss'
})


export class FieldAutoCompleteComponent implements OnInit {
  control = new FormControl('');
  
  @Input() list: string[] = []
  @Input() placeholder: string = "";
  @Input() invalid:boolean = false;

  //@Input() 
  filteredStreets: Observable<string[]> = of([]);

  ngOnInit() {
    this.filteredStreets = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.list.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
  

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


}

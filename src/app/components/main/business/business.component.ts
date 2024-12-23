import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserAndROLE, UserLogin } from '../../../models/User';
import { BusinessService } from '../../../service/business.service';
import { OperationsFrontService } from '../../../service/operations-front.service';
import { BusinessDTO, UpdateBusinessDTO } from '../../../models/business';
import { StorageService } from '../../../interceptors/storage.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatTableModule
    
  ],
  templateUrl: './business.component.html',
  styleUrl: './business.component.scss'
})
export class BusinessComponent implements OnInit{
  businessGroup!: FormGroup;
  submitted:boolean = true;
  username!:string ;
  idBusiness!:number

  constructor(
    private fb:FormBuilder,
    private businessService:BusinessService,
    private helping:OperationsFrontService,
    private storageService:StorageService,
    private authService:AuthService
  )
  {
    this.businessGroup = this.fb.group({
      name: ['', Validators.required], 
      description: ['', Validators.required], 
      ruc: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getDataBusiness();
    this.getDataUserAndRoles();
    this.username =  this.storageService.getUser()??'User';

  }

  getDataBusiness(){
    
    this.helping.setLoading(true)              

    this.businessService.getDataBusinessAdmin().subscribe({
      next:(res)=>{
        console.log(res)
        this.setDataForm(res)
        this.idBusiness = res.id
        this.helping.setLoading(false)              

      },
      error:(err)=>{

      }
    })
  }

  
  setDataForm(data:BusinessDTO){
    this.imageSrc = data.urlImage?data.urlImage:"";
    this.businessGroup = this.fb.group({
      name: [data.name, Validators.required], 
      description: [data.description, Validators.required], 
      ruc: [data.ruc, Validators.required],
      address: [data.address, Validators.required],
      phone: [data.phone, Validators.required],
      message: [data.message, Validators.required],
    });
  }
  getDataForm(): UpdateBusinessDTO{
    return{
      id:this.idBusiness,
      name: this.businessGroup.get('name')?.value, 
      description: this.businessGroup.get('description')?.value,
      ruc: this.businessGroup.get('ruc')?.value,
      address: this.businessGroup.get('address')?.value,
      phone: this.businessGroup.get('phone')?.value,
      message: this.businessGroup.get('message')?.value,
      urlImage:""
      //urlImage:this.imageSrc
    }
  }







  img!:File;
  imageSrc!: string ; 
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.img = file as File;
    console.log(this.img)
    if (file) {
      // Validar tamaño del archivo (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 2MB.');
        return;
      }

      // Validar formato del archivo
      const validFormats = ['image/png', 'image/jpeg'];
      if (!validFormats.includes(file.type)) {
        alert('Solo se permiten imágenes PNG o JPG.');
        return;
      }

      // Leer el archivo y establecer la fuente
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
      
    }
  }







  updateBusiness(){
      const data:UpdateBusinessDTO = this.getDataForm();
      this.helping.setLoading(true)
      this.businessService.updateBusiness(data,this.img).subscribe({
        next:async (res)=>{
          await this.helping.openSnackBar(res.message,"OK",3000)
          window.location.reload()
        },
        error:(err)=>{      
          this.helping.openSnackBar(err.message,"OK",3000)
        },
        complete:()=>{
          this.helping.setLoading(false)
        }
      })
      
  }




  displayedColumns: string[] = ['user','role'];
  dataSource = new MatTableDataSource<UserAndROLE>;

  getDataUserAndRoles(){
    this.helping.setLoading(true)              

    this.businessService.getUserAndRoles().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource<UserAndROLE>(res.body);
        this.helping.setLoading(false)              

      },
      error:(err)=>{

      }
    })
  }


  addUser(){
    const username =  prompt("Usuario: ")
    const password = prompt("Contraseña: ")
    if(username === "" || password === ""){
      this.helping.openFieldError(()=>{},"Usuario no puede ser vacio")
      return;
    }
    const data:UserLogin ={
      username:username!,
      password:password!
    }

    this.helping.setLoading(true)
    this.authService.registerNewUser(data).subscribe({
      next:async (res:any)=>{
        await this.helping.openSnackBar(res.message,"OK",5000)
        window.location.reload()
      },
      error:(err)=>{
        this.helping.openSnackBar(err.message,"OK",5000)

      },
      complete:()=>{
        this.helping.setLoading(false)

      }
    });
  }

}

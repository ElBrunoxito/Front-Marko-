import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule si usas Angular Material
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule si usas Angular Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../service/http.service';
import { AuthResponse, UserLogin } from '../../../models/User';
import { StorageService } from '../../../interceptors/storage.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginGroup!:FormGroup;

  constructor(
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private userService:AuthService,
    private storaegeService:StorageService,
    private router:Router,
    private httpService:HttpService


    
  ){


  }
  ngOnInit(): void {
    this.loginGroup = this.fb.group({
      username: ['', [Validators.required,Validators.minLength(3)]],
      password: ['', [Validators.required,Validators.minLength(5)]]
    });
  }



  async login() {
    //this.httpService.downloadPdf("https://firebasestorage.googleapis.com/v0/b/marko-e432c.appspot.com/o/Mi Negocio S.A.C.%2Fpdf_T0001.pdf?alt=media")

    if(this.loginGroup.valid){

      const user:UserLogin = this.loginGroup.value as UserLogin;
      await this.userService.login(user).subscribe({
        next:(response:any)=>{
          this.storaegeService.setToken(response.access_token)
          this.storaegeService.setUser(response.username)
          this.storaegeService.setExpirationDate(response.expires_in)
          this.storaegeService.setRoles(response.roles);

          //this.authService.setToken(response.token.toString())
          //this.authService.setExpirationDate(response.expirationDate)
          //console.log(response.expirationDate);
          //SetRoles
          //this.
          this.router.navigateByUrl("main");
        },
        error:(err)=>{
          console.log(err)
        }
      })

      
    }else{
     /* this.snackBar.open('Username or Password ist validswwwwwaaawwwwwwwwww','', {
        duration: 3000, // Duración en milisegundos
        horizontalPosition: 'start', // Posición horizontal
        verticalPosition: 'top', // Posición vertical
        panelClass: ['custom-snackbar'] // Clase CSS personalizada
      });*/
      this.snackBar.open('algo salio mals', '', {
        duration: 3000,
        verticalPosition:"bottom",
        horizontalPosition:"center"

      });
    }
  }


}

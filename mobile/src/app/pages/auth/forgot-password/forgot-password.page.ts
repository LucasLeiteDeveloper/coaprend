import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  //method to submit the e-mail to reset pasword
  async submitEmail() {
    this.isLoading = true;

    try {
      //if the e-mail isn't valid
      if(!this.email || this.email.trim() === '') throw new Error("Por favor, digite seu e-mail");

      //send the e-mail to the service's method without spaces on string
      await this.authService.sendResetEmail(this.email.trim());

      //shows the success
      await this.presentAlert(
        'E-mail enviado!',
        'Verifique sua caixa de entrada (e spam). Você será redirecionado para o login'
      );

      //go to login 
      this.router.navigate(['/login']);
    } catch(error: any){
      //prepares the error message
      let message = "Ocorreu um erro desconhecido!";

      if(error.code === "auth/user-not-found"){
        message = "Se o e-mail estiver cadastrado, o link será enviado!"
      } else if(error.code === "auth/invalid-email"){
        message = "O formato do e-mail é inválido!";
      } else if(error.message){
        message = error.message;
      }

      this.presentAlert("Erro", message);
    } finally {
      this.isLoading = false;
    }
  }

  // show the alert
  async presentAlert(header: string, message: string){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present()
  }

}

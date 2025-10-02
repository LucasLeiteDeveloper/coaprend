import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/apiService/api-service';
import { LoginService } from 'src/app/services/loginService/login-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  public error: string = 'Seu e-mail ou senha estão incorretos, confira-os.';
  public form: any = {
    email: '',
    password: '',
  };

  constructor(
    private Login: LoginService,
    private Api: ApiService
  ) {}

  ngOnInit() {}

  submitForm(): String | void {
    if (!this.Login.isFormDataValid(this.form))
      return this.error = "Erro";
    else
      this.Api.postLogin(this.form);
  }
}

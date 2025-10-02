import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  form: any = {
    email: "",
    password: "",
  };

  constructor() { }

  ngOnInit() {
  }

  test() {
    console.log(this.form.email);
  }

}

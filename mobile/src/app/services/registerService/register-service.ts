import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor() { }

  isFormDataValid(formData: any): boolean {
    const isValid = (
      !!formData.name && 
      !!formData.email && 
      !!formData.password && 
      formData.password === formData.password_confirmation
    );
    return isValid;
  }
}
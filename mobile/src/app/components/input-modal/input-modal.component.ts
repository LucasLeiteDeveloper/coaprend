import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
  
@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  standalone: true,
})
export class InputModalComponent  implements OnInit {
  @Input() inputType: string = "text";
  @Input() title: string = "";
  public inputValue: string = "";

  constructor(
    private modal: ModalController,
  ) { }

  ngOnInit() {}

  cancel() {
    return this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modal.dismiss(this.inputValue, 'confirm');
  }
}

import { Component } from '@angular/core';
import { NavController, PopoverController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'menu-criacao',
  templateUrl: './menu-criacao.component.html',
  styleUrls: ['./menu-criacao.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})

export class MenuCriacaoComponent {
  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) {}

  async criarClasse() {
    await this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward('/create/class');
  }

  async criarPost() {
    await this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward('/create/post');
  }

  async criarTarefa() {
    await this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward('/create/task');
  }
}

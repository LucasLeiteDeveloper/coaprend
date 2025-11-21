import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.page.html',
  styleUrls: ['./class-select.page.scss'],
  standalone: false,
})
export class ClassSelectPage implements OnInit {
  public classes: any = [
    {
      name: "teste",
      id: 1,
    },
    {
      name: "teste2",
      id: 2,
    },
    {
      name: "teste2",
      id: 2,
    },
    {
      name: "teste2",
      id: 2,
    }
  ]

  constructor(private alert: AlertController,) { }

  ngOnInit() {
  }

  async exitClassAlert(name: string, id: any) {
    const alert = await this.alert.create({
      header: `Deseja sair de ${name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // O que acontece se cancelar
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            // O que acontece se confirmar
          },
        },
      ]
    });

    await alert.present();
  }

  async enterClassAlert() {
    const alert = await this.alert.create({
      header: `Insira o link da sala`,
      inputs: [
        {
          placeholder: 'Digite aqui...',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // O que acontece se cancelar
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            // O que acontece se confirmar
          },
        },
      ]
    });

    await alert.present();
  }
}

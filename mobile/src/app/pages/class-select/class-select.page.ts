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
      // subHeader: 'A Sub Header Is Optional',
      // message: 'A message should be a short, complete sentence.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
          },
        },
      ]
    });

    await alert.present();
  }

}

import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { MenuCriacaoComponent } from '../menu-criacao/menu-criacao.component';
@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['./footer-nav.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class FooterNavComponent {
  @Input() selectedTab!: string;
  @Input() classId!: string;

  constructor(
    private popover: PopoverController
  ){

  }

  async openCreateNav(ev: any) {
    const popover = await this.popover.create({
      component: MenuCriacaoComponent,
      event: ev,
      translucent: true,
      animated: false,
      cssClass: 'menu-criacao-popover',
    });
    await popover.present();
  }
}
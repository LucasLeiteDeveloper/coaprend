import { Component, OnInit } from '@angular/core';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  public classId: any = 0;
  public postExample: {} = {
    title: 'Post de teste',
    author: 'Usuário de teste',
    items: [{ content: 'Conteudo de teste' }],
  };

  constructor(
    private route: ActivatedRoute,
    private popover: PopoverController,
    public scroll: HideOnScrollService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
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

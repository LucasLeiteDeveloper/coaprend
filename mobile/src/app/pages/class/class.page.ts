import { Component, OnInit } from '@angular/core';
import { ScrollDetail, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  public isHidden: boolean = false;
  public postTab: boolean = true;
  public taskTab: boolean = false;
  public calendarTab: boolean = false;
  private lastScrollTop: number = 0;
  public classId: any = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
  }

  // 🔹 Atualiza a sala selecionada
  onSalaSelecionada(idSala: number) {
    this.classId = idSala;
    this.router.navigate(['/class', idSala, 'post']);
  }

  // 🔹 Efeito de esconder header/footer ao rolar
  onContentScroll(event: CustomEvent<ScrollDetail>) {
    const scrollTop = event.detail.scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      if (!this.isHidden) this.isHidden = true;
    } else if (scrollTop < this.lastScrollTop || scrollTop === 0) {
      if (this.isHidden) this.isHidden = false;
    }
    this.lastScrollTop = scrollTop;
  }

  // 🔹 Seleção das abas (post, tarefa, calendário)
  selectTab(tab: string) {
    this.postTab = tab === 'post';
    this.taskTab = tab === 'tasks';
    this.calendarTab = tab === 'calendar';
  }

  // 🔹 Abre o mini menu flutuante de criação
  async abrirMenuCriacao(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuCriacaoComponent,
      event: ev,
      translucent: true,
      cssClass: 'menu-criacao-popover',
    });

    await popover.present();
  }
}


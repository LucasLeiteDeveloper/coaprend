import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { BehaviorSubject } from 'rxjs';
import { TagService } from 'src/app/services/tagService/tag';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  public selectedTab: string = "";
  public classId!: number;
  public tags: any = [
    {
      id: 1,
      text: "teste",
      color: "blue",
      selected: false,
    }
  ];

  // BehaviorSubject para notificar filhos sobre as tags selecionadas
  public tagFilter$ = new BehaviorSubject<number[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    public scroll: HideOnScrollService,
    private tagService: TagService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) return;
      this.classId = Number(idParam);

      // Agora que temos classId, buscar tags reais da sala
      this.loadTags();
    });

    this.selectedTab = this.router.url.split('/')[3];
  }

  private loadTags() {
    this.tagService.getTagsByClass(this.classId).subscribe({
      next: (tags) => {
        // Inicializa a propriedade `selected` como false para todas
        this.tags = tags.map((t: any) => ({ ...t, selected: false }));
      },
      error: (err) => {
        console.error('Erro ao carregar tags da sala:', err);
      }
    });
  }

  get selectedTags(): number[] {
    return this.tags.filter((t: any) => t.selected).map((t: any) => t.id);
  }

  onSelectClass(id: any) {
    this.classId = id;
    this.router.navigate(['/class', this.classId, 'post']);
  }

  onTabChange(tab: string) {
    this.selectedTab = tab;
  }

  async openCreateNav(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuCriacaoComponent,
      event: ev,
      translucent: true,
      animated: false,
      cssClass: 'menu-criacao-popover',
    });
    await popover.present();
  }

  selectTag(id: number) {
    const tag = this.tags.find((t: any) => t.id === id);
    if (!tag) return;

    tag.selected = !tag.selected;

    const tagElement = document.getElementById("tag" + id);
    tagElement?.classList.toggle("selected", tag.selected);

    this.tagFilter$.next(this.selectedTags);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  public selectedTab: string = "";
  public classId!: string;
  public tags: any[] = [];
  public classData: any = {
    title: ''
  };
  // BehaviorSubject para notificar filhos sobre as tags selecionadas
  public tagFilter$ = new BehaviorSubject<number[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    public scroll: HideOnScrollService,
  ) {}

  // TODO: need to make a call for the tagService to load the class tags
  ngOnInit() {
    this.classId = this.route.snapshot.params['id'];
    this.selectedTab = this.router.url.split('/')[3];
    this.loadData(this.classId);
  }

  // TODO: does this need to be stored in localStorage?
  async loadData(id: string | null){
    if(!id) return;
    const response = await this.contentService.getClassDetails(id);
    this.classData = response;
    console.log("Id da sala: ", response.id)
    localStorage.setItem("classId", response.id);
  }

  // TODO: move this to tagService
  get selectedTags(): number[] {
    return this.tags.filter(t => t.selected).map(t => t.id);
  }

  // TODO: move this to tagService
  selectTag(id: number) {
    const tag = this.tags.find(t => t.id === id);
    if (!tag) return;

    tag.selected = !tag.selected;

    const tagElement = document.getElementById("tag" + id);
    tagElement?.classList.toggle("selected", tag.selected);

    // Notifica os filhos sobre as tags selecionadas
    this.tagFilter$.next(this.selectedTags);
  }
}

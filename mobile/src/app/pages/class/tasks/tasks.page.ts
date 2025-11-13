import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
@Injectable({
  providedIn: 'root',
})
export class TasksPage implements OnInit {
  private roomId: string | null;

  tasks: any[] | undefined = [];
  public isLoading: boolean = false;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute
  ) {
    this.roomId = this.route.snapshot.paramMap.get('roomId');

    if(!this.roomId) console.error("ID da sala não encontrado na URL!");
  }

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks(){
    if(!this.roomId) return;

    this.isLoading = true;
    try {
      this.tasks = await this.contentService.getTasks(this.roomId);

      console.log("Tarefas carregadas: ", this.tasks);
    } catch(error){
      console.error("Erro ao carregar tarefas: ", error);
    } finally{
      this.isLoading = false;
    }
  }
}

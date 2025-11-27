import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class TaskCardComponent implements OnInit {
  @Input() multiTasks: boolean = true;
  @Input() task: any;
  @Input() skeleton: boolean = false;
  public displayTags: any;

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const taskTags: any = this.task.tags; // Resultado: [1]
    let classTags: any = this.http.get("assets/class-data.json").subscribe({
      next: (data: any) => {
        classTags = data[0].tags;
        console.log('Tasks carregados:', classTags);
        this.displayTags = classTags.filter((tag: any) => taskTags.includes(tag.id));
        console.log(this.displayTags)
      },
      error: (err) => {
        console.error('Erro ao carregar tasks:', err);
      },
    });
  }
}

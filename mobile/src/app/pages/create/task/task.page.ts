import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {
  title: string = '';
  description: string = '';
  deadline: string = '';
  tagColor: string = '#000000';

  roomId!: number;

  tags: string[] = [];
  newTag: string = '';

  attachments: File[] = [];

  isSubmitting = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
  }

  addTag() {
    if (!this.newTag.trim()) return;
    this.tags.push(this.newTag.trim());
    this.newTag = '';
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let f of files) {
      this.attachments.push(f);
    }
  }

  removeAttachment(i: number) {
    this.attachments.splice(i, 1);
  }

  submit() {
    if (!this.title.trim() || !this.description.trim() || !this.deadline) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      title: this.title,
      type: 'task',
      content: this.description,
      tag_color: this.tagColor,
      options: this.tags,
      room_id: this.roomId,
      deadline: this.deadline
    };

    this.taskService
      .createFormData(payload, this.attachments)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/class', this.roomId]);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting = false;
          alert('Erro ao criar tarefa.');
        },
      });
  }
}

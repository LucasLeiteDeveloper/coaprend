import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { TaskService } from 'src/app/services/taskService/task';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {

  private searchSubject = new Subject<string>();

  postsResultados: any[] = [];
  tasksResultados: any[] = [];

  constructor(
    private postService: PostService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    // debounce para evitar spam no backend
    this.searchSubject.pipe(debounceTime(300)).subscribe((text) => {
      this.buscarNoBackend(text);
    });
  }

  onSearch(event: any) {
    const value = event.detail.value.trim();
    this.searchSubject.next(value);
  }

  buscarNoBackend(text: string) {
    if (!text) {
      this.postsResultados = [];
      this.tasksResultados = [];
      return;
    }

    // 🔍 chama backend para posts
    this.postService.search(text).subscribe((res: any) => {
      this.postsResultados = res.posts ?? res ?? [];
    });

    // 🔍 chama backend para tasks
    this.taskService.search(text).subscribe((res: any) => {
      this.tasksResultados = res.tasks ?? res ?? [];
    });
  }
}

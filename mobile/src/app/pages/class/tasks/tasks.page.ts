import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  tasks: any[] = [];
  public taskExample: {} = {
    title: 'Post de teste',
    dueDate: '25/10/2025',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
@Injectable({
  providedIn: 'root',
})
export class ClassPage implements OnInit {
  posts: any[] = [];

  constructor(private http: HttpClient) {}

  // Esta função retorna um array de posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>('assets/posts-data.json');
  }

  ngOnInit() {
    this.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }
}

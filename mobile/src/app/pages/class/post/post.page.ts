import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})
@Injectable({
  providedIn: 'root',
})
export class PostPage implements OnInit {
  posts: any[] = [];
  classId: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  // Esta função retorna um array de posts
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>('assets/posts-data.json');
  }

  ngOnInit() {
    this.getPosts().subscribe((data) => {
      this.posts = data;
      this.classId = +this.route.snapshot.paramMap.get('id')!;
    });
  }
}

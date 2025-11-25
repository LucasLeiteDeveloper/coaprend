import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PostCardComponent implements OnInit {
  @Input() post: any = [];
  @Input() classTags: any = "";
  @Input() multiPosts: boolean = true;
  public displayTags: any;


  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const postTags: any = this.post.tags; // Resultado: [1]
    let classTags: any = this.http.get("assets/class-data.json").subscribe({
      next: (data: any) => {
        classTags = data[0].tags;
        console.log('Posts carregados:', classTags);
        this.displayTags = classTags.filter((tag: any) => postTags.includes(tag.id));
        console.log(this.displayTags)
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      },
    });
  }
}

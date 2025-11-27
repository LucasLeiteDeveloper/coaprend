import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/postService/post';
import { PostInterface } from 'src/app/services/postService/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})

export class PostPage implements OnInit {
  public post!: PostInterface;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id')!;
    this.post = this.postService.get.byPostId(postId)!;
  }
}
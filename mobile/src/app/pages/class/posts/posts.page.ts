import { Component, OnInit } from '@angular/core'; 
import { PostService } from 'src/app/services/postService/post';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})

export class PostsPage implements OnInit {
  public posts: any;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const classId = this.route.snapshot.paramMap.get('id')!;
    this.posts = this.postService.get.byClassId(classId);

    // this.classPage.tagFilter$.subscribe(() => {
    //   this.applyTagFilter();
    // });
  }
}

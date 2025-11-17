import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostsPageRoutingModule } from './posts-routing.module';
import { PostsPage } from './posts.page';
import { PostCardComponent } from 'src/app/components/post-card/post-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostsPageRoutingModule,
    PostCardComponent,
  ],
  declarations: [PostsPage]
})
export class PostsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostPageRoutingModule } from './post-routing.module';
import { PostPage } from './post.page';
import { PostCardComponent } from 'src/app/components/post-card/post-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPageRoutingModule,
    PostCardComponent,
  ],
  declarations: [PostPage]
})
export class PostPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostPageRoutingModule } from './post-routing.module';
import { PostPage } from './post.page';
import { ClassSelectorComponent } from 'src/app/components/class-selector/class-selector.component';
import { PostCardComponent } from 'src/app/components/post-card/post-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostPageRoutingModule,
    ClassSelectorComponent,
    PostCardComponent,
  ],
  declarations: [PostPage]
})
export class PostPageModule {}

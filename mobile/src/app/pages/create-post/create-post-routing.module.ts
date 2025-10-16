import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostCreatePage } from './create-post.page';

const routes: Routes = [
  {
    path: '',
    component: PostCreatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePostPageRoutingModule {}

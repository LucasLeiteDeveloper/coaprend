import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassSelectPage } from './class-select.page';

const routes: Routes = [
  {
    path: '',
    component: ClassSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassSelectPageRoutingModule {}

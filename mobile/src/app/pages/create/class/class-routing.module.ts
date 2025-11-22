import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateClassPage } from './class.page';

const routes: Routes = [
  {
    path: '',
    component: CreateClassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassPageRoutingModule {}

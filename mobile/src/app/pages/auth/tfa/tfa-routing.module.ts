import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TfaPage } from './tfa.page';

const routes: Routes = [
  {
    path: '',
    component: TfaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TfaPageRoutingModule {}

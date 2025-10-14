import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassPage } from './class.page';

const routes: Routes = [
  {
    path: '',
    component: ClassPage
  },
  {
    path: ':post',
    loadChildren: () => import('./post/post.module').then( m => m.PostPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then( m => m.TasksPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./calendar/calendar.module').then( m => m.CalendarPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassPageRoutingModule {}

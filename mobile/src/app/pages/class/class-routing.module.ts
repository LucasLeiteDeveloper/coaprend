import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassPage } from './class.page';

const routes: Routes = [
  {
    path: '',
    component: ClassPage,
    children: [
      {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then((m) => m.CalendarPageModule),
      },
      {
        path: 'posts',
        loadChildren: () => import('./posts/posts.module').then((m) => m.PostsPageModule),
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then((m) => m.TasksPageModule),
      },
      {
        path: '',
        redirectTo: 'post',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'agenda',
    loadChildren: () =>
      import('./oldPages/agenda/agenda.module').then((m) => m.AgendaPageModule),
  },
  {
    path: 'policy',
    loadChildren: () =>
      import('./pages/static/policy/policy.module').then(
        (m) => m.PolicyPageModule
      ),
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./pages/static/terms/terms.module').then(
        (m) => m.TermsPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/auth/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'tag',
    loadChildren: () => import('./pages/create/tag/tag.module').then( m => m.TagPageModule)
  },
  {
    path: 'tfa',
    loadChildren: () => import('./pages/auth/tfa/tfa.module').then( m => m.TfaPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  // CREATING PATHS
  {
    path: 'create/class',
    loadChildren: () => import('./pages/create/class/class.module').then( m => m.ClassPageModule)
  },
  {
    path: 'create/task/:roomId',
    loadChildren: () => import('./pages/create/task/task.module').then( m => m.TaskPageModule)
  },
  // SHOWING PATHS
  {
    path: 'class/:roomId/posts',
    loadChildren: () => import('./pages/class/post/post.module').then( m => m.PostPageModule)
  },
  {
    path: 'class/:roomId/tasks',
    loadChildren: () => import('./pages/class/tasks/tasks.module').then( m => m.TasksPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

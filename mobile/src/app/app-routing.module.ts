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
    path: 'class/:id',
    loadChildren: () => import('./pages/class/class.module').then( m => m.ClassPageModule)
  },  {
    path: 'create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

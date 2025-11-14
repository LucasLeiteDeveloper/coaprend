import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
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
    loadChildren: () =>
      import('./pages/class/class.module').then((m) => m.ClassPageModule),
  },
  {
    path: 'create-post',
    loadChildren: () =>
      import('./oldPages/create-post/create-post.module').then(
        (m) => m.PostCreatePageModule
      ),
  },
  {
    path: 'create-task',
    loadChildren: () =>
      import('./oldPages/create-task/create-task.module').then(
        (m) => m.CreateTaskPageModule
      ),
  },
  {
    path: 'post/:id',
    loadChildren: () =>
      import('./pages/post/post.module').then((m) => m.PostPageModule),
  },
  {
    path: 'task/:id',
    loadChildren: () =>
      import('./pages/task/task.module').then((m) => m.TaskPageModule),
  },
  {
    path: 'tfa',
    loadChildren: () =>
      import('./pages/auth/tfa/tfa.module').then((m) => m.TfaPageModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/auth/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'create-class',
    loadChildren: () =>
      import('./pages/create-class/create-class.module').then(
        (m) => m.CreateClassPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

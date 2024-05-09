import { Route } from '@angular/router';

const APP_ROUTES: Array<Route> = [
  {
    path: 'all',
    loadComponent: () =>
      import('./list-tasks/list-tasks.component').then(
        (c) => c.ListTasksComponent
      ),
  },
  {
    path: 'view/:id',
    loadComponent: () =>
      import('./task-view/task-view.component').then(
        (c) => c.TaskViewComponent
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'all' },
  { path: '**', pathMatch: 'full', redirectTo: 'all' },
];

export const fromRoutes = {
  APP_ROUTES,
};

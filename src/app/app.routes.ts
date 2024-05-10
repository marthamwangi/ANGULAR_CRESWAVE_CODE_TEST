import { Route } from '@angular/router';

const APP_ROUTES: Array<Route> = [
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/list-tasks/list-tasks.component').then(
        (c) => c.ListTasksComponent
      ),
  },
  {
    path: 'tasks/:id',
    loadComponent: () =>
      import('./pages/task-view/task-view.component').then(
        (c) => c.TaskViewComponent
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: '**', pathMatch: 'full', redirectTo: 'tasks' },
];

export const fromRoutes = {
  APP_ROUTES,
};

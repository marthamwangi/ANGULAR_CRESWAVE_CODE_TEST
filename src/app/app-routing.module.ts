import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { fromRoutes } from './app.routes';

@NgModule({
  imports: [RouterModule.forRoot(fromRoutes.APP_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

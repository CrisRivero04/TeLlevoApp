import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministradorViajesPage } from './administrador-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: AdministradorViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorViajesPageRoutingModule {}

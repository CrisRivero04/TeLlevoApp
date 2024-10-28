import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrarViajePage } from './administrar-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: AdministrarViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrarViajePageRoutingModule {}

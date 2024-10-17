import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarViajePage } from './generar-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: GenerarViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerarViajePageRoutingModule {}

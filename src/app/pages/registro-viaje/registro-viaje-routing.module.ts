import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroViajePage } from './registro-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroViajePageRoutingModule {}

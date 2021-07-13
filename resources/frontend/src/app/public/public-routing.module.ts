import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuessGuard } from '../auth/guess.guard';
import { RegistroDonadorComponent } from './registro-donador/registro-donador.component';
import { InfoQrDonanteComponent } from './info-qr-donante/info-qr-donante.component';

const routes: Routes = [
  { path: 'registro', component: RegistroDonadorComponent, canActivate: [GuessGuard] },
  { path: 'qr-donante/:id', component: InfoQrDonanteComponent, canActivate: [GuessGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

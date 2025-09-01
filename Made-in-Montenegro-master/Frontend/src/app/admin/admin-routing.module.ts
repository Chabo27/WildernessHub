import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProducersComponent } from './producers/producers.component';
import { ProducerFormComponent } from './producer-form/producer-form.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { OrderComponent } from './order/order.component';
import { TypesComponent } from './types/types/types.component';
import { TypeFormComponent } from './types/type-form/type-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent, 
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'porudzbine', pathMatch: 'full' },
      { path: 'porudzbine', component: OrderComponent },
      { path: 'proizvodi', component: ProductsComponent },
      { path: 'proizvodi/dodajNoviProizvod', component: ProductFormComponent },
      { path: 'proizvodi/izmijeniPostojeciProizvod/:id', component: ProductFormComponent },
      { path: 'proizvodjaci', component: ProducersComponent },
      { path: 'proizvodjaci/dodajNovogProizvodjaca', component: ProducerFormComponent },
      {
        path: 'proizvodjaci/izmijeniPostojecegProizvodjaca/:id',
        component: ProducerFormComponent,
      },
      { path: 'tipovi', component: TypesComponent },
      { path: 'tipovi/dodajNoviTip', component: TypeFormComponent },
      { path: 'tipovi/izmijeniPostojeciTip/:id', component: TypeFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

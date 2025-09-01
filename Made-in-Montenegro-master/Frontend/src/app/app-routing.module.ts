import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { CartPageComponent } from './modules/cart/pages/cart-page/cart-page.component';
import { PurchaseConfirmationComponent } from './modules/purchases/pages/purchase-confirmation/purchase-confirmation.component';
import { KarticaPlacanjeComponent } from './modules/payments/pages/kartica-placanje/kartica-placanje.component';
import { OrderHistoryComponent } from './modules/purchases/pages/order-history/order-history.component';
import { ProfileComponent } from './modules/users/pages/profile/profile.component';
import { ProducersComponent } from './admin/producers/producers.component';
import { ProducerFormComponent } from './admin/producer-form/producer-form.component';
import { ManufacturerDetailsComponent } from './modules/manufacturer-details/manufacturer-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'proizvodi',
    loadChildren: () =>
      import('./modules/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'purchases',
    loadChildren: () =>
      import('./modules/purchases/purchases.module').then(
        (m) => m.PurchasesModule
      ),
  },
  {
    path: 'korpa',
    component: CartPageComponent,
  },
  {
    path: 'potvrda',
    component: PurchaseConfirmationComponent,
  },
  { path: 'placanje-karticom', component: KarticaPlacanjeComponent },
  {
    path: 'moje-narudzbe',
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profil', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
  path: 'brend/:id',
  component: ManufacturerDetailsComponent 
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

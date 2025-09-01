import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../app/core/intereceptors/jwt.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './modules/home/home.module';
import { CartPageComponent } from './modules/cart/pages/cart-page/cart-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KarticaPlacanjeComponent } from './modules/payments/pages/kartica-placanje/kartica-placanje.component';
import { ManufacturerDetailsComponent } from './modules/manufacturer-details/manufacturer-details.component';




@NgModule({
  declarations: [
    AppComponent,
    CartPageComponent,
    KarticaPlacanjeComponent,
    ManufacturerDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    PurchasesModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HomeModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

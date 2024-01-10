import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { CiudadModalComponent } from './components/modal/ciudad-modal/ciudad-modal.component';
import { CategoriaModalComponent } from './components/modal/categoria-modal/categoria-modal.component';
import { SubcategoriaModalComponent } from './components/modal/subcategoria-modal/subcategoria-modal.component';
import { UserModalComponent } from './components/modal/user-modal/user-modal.component';
import { ProductComponent } from './components/product/product.component';
import { PayModalComponent } from './components/modal/pay-modal/pay-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CiudadModalComponent,
    CategoriaModalComponent,
    SubcategoriaModalComponent,
    UserModalComponent,
    ProductComponent,
    PayModalComponent,
  ],
  imports: [
		ReactiveFormsModule,
		HttpClientModule,
		FormsModule,
		DataTablesModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
	exports: [
		DataTablesModule
	]
})
export class AppModule { }

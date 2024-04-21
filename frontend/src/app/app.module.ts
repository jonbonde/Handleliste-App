import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from  '@angular/common/http';
import { CreateListComponent } from './components/create-list/create-list.component';
import { AddItemToListComponent } from './components/add-item-to-list/add-item-to-list.component';
import { ManageListsComponent } from './components/manage-lists/manage-lists.component';
import { RedirectComponent } from './components/redirect/redirect.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateListComponent,
    AddItemToListComponent,
    ManageListsComponent,
    RedirectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

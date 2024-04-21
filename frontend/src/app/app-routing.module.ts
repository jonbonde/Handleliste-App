import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateListComponent } from './components/create-list/create-list.component';
import { AddItemToListComponent } from './components/add-item-to-list/add-item-to-list.component';
import { ManageListsComponent } from './components/manage-lists/manage-lists.component';
import { RedirectComponent } from './components/redirect/redirect.component';

const routes: Routes = [
  { path: 'new-list', component: CreateListComponent },
  { path: 'list/:id', component: AddItemToListComponent },
  { path: 'frontpage', component: ManageListsComponent },
  { path: '**', component: RedirectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

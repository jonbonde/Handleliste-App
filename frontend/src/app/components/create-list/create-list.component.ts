import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css']
})
export class CreateListComponent {
  newShoppingList!: ShoppingList;

  constructor(private shoppingListService: ShoppingListService, private router: Router) { }

  addShoppingList(name: string): void {
    this.shoppingListService.addShoppingList({name}).subscribe(shoppingList => {
      this.newShoppingList = shoppingList;
      this.router.navigate([`/list/${this.newShoppingList.id}`]);
    });
  }
}

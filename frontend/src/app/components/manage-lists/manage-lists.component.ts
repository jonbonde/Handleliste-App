import { Component } from '@angular/core';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-manage-lists',
  templateUrl: './manage-lists.component.html',
  styleUrls: ['./manage-lists.component.css']
})
export class ManageListsComponent {
  allLists!: ShoppingList[];

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.shoppingListService.getLists().subscribe(allLists => {
      this.allLists = allLists;
    });
  }

  deleteList(list_id: number): void {
    this.shoppingListService.deleteList({list_id}).subscribe(allLists => {
      this.allLists = allLists;
    });
  }
}

import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { ItemsOnList } from 'src/app/interfaces/items-on-list';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ItemService } from 'src/app/services/item.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-add-item-to-list',
  templateUrl: './add-item-to-list.component.html',
  styleUrls: ['./add-item-to-list.component.css']
})
export class AddItemToListComponent {
  listId!: number;
  allItems!: Item[];
  myList!: ShoppingList;
  showAllItems: boolean = false;
  searchResult!: Item[];
  itemsOnList!: ItemsOnList[];

  constructor(private itemService: ItemService, private shoppingListService: ShoppingListService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.listId = params['id'];
      this.shoppingListService.getMyList(this.listId).subscribe(myList => {
        this.myList = myList;
      });
      this.getItemsOnList(this.listId);
    });

    this.itemService.getItems().subscribe(items => {
      this.allItems = items;
    });
  }

  addItem(name: string): void {
    const foundItem = this.allItems.find(item => item.item_name === name);
    if (foundItem) {
      this.addItemToList(foundItem.id, this.listId);
    } else {
      this.itemService.addItem({name}).subscribe(item => {
        this.allItems.push(item);
        this.addItemToList(item.id, this.listId);
      });
    }
  }

  addItemToList(item_id: number, list_id: number): void {
    this.shoppingListService.addItemToList({item_id, list_id}).subscribe(ids => {
      this.shoppingListService.getMyList(this.listId).subscribe(myList => {
        this.getItemsOnList(this.listId);
        this.myList = myList;
      });
    });
  }

  toggleItems(): void {
    this.showAllItems = !this.showAllItems;
  }

  deleteFromList(item_id: number, list_id: number): void {
    this.shoppingListService.deleteFromList({item_id, list_id}).subscribe(myList => {
      this.myList = myList;
    });
  }

  searchItem(search: string): void {
  if (search === null || search === undefined || search.trim() === '') {
    this.clearSearch();
  } else {
    this.itemService.searchItems(search).subscribe(items => {
      this.searchResult = items;
    });
  }
  }

  clearSearch(): void {
    this.searchResult = [];
  }

  getItemsOnList(list_id: number): void {
    this.shoppingListService.getItemsOnList(list_id).subscribe(itemsOnList => {
      this.itemsOnList = itemsOnList;
    });
  }

  strikeOut(id_item: number, id_list: number): void {
    this.itemService.strikeOut({id_item, id_list}).subscribe(itemsOnList => {
      this.itemsOnList = itemsOnList;
      this.getItemsOnList(id_list);
    });
  }
}

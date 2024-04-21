import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from '../interfaces/item';
import { Observable, catchError } from 'rxjs';
import { ShoppingListService } from './shopping-list.service';
import { ItemsOnList } from '../interfaces/items-on-list';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private shoppingListService: ShoppingListService) { }

  addItem(data: { name: string }): Observable<Item> {
    const url = `${this.baseUrl}/rpc/insert_item`;
    return this.http.post<Item>(url, data);
  }

  getItems(): Observable<Item[]> {
    const url = `${this.baseUrl}/rpc/get_items`;
    return this.http.get<Item[]>(url);
  }

  searchItems(search: string): Observable<Item[]> {
    const url = `${this.baseUrl}/items?item_name=ilike.${search}*`;
    return this.http.get<Item[]>(url);
  }

  strikeOut(data: {id_item: number, id_list: number}): Observable<ItemsOnList[]> {
    const url = `${this.baseUrl}/rpc/strike_out`;
    return this.http.post<ItemsOnList[]>(url, data);
  }
}

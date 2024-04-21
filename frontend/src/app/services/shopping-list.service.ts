import { Injectable } from '@angular/core';
import { ShoppingList } from '../interfaces/shopping-list';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemsOnList } from '../interfaces/items-on-list';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  addShoppingList(data: {name: string}): Observable<ShoppingList> {
    const url = `${this.baseUrl}/rpc/insert_list`;
    return this.http.post<ShoppingList>(url, data);
  }

  addItemToList(data: {item_id: number, list_id: number}): Observable<ItemsOnList> {
    const url = `${this.baseUrl}/rpc/add_item_to_list`;
    return this.http.post<ItemsOnList>(url, data);
  }

  getLists(): Observable<ShoppingList[]> {
    const url = `${this.baseUrl}/rpc/get_lists`;
    return this.http.get<ShoppingList[]>(url);
  }

  getMyList(list_id: number): Observable<ShoppingList> {
    const url = `${this.baseUrl}/rpc/get_my_list`;
    const params = new HttpParams().set("list_id", list_id);
    return this.http.get<ShoppingList>(url, { params: params });
  }

  getItemsOnList(list_id: number): Observable<ItemsOnList[]> {
    const url = `${this.baseUrl}/rpc/get_items_on_lists`;
    const params = new HttpParams().set("id_list", list_id);
    return this.http.get<ItemsOnList[]>(url, {params});
  }

  deleteFromList(data: {item_id: number, list_id: number}): Observable<ShoppingList> {
    const url = `${this.baseUrl}/rpc/delete_from_list`;
    return this.http.post<ShoppingList>(url, data);
  }

  deleteList(data: {list_id: number}): Observable<ShoppingList[]> {
    const url = `${this.baseUrl}/rpc/delete_list`;
    return this.http.post<ShoppingList[]>(url, data);
  }
}

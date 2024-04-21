import { Item } from "./item";

export interface ShoppingList {
    id: number;
    created_at: Date;
    list_name: string;
    items: Item[];
}
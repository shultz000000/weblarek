import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

/**
 * Корзина: хранит товары, выбранные для покупки
 */
export class BasketModel {
    protected items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    add(product: IProduct): void {
        if (!this.has(product.id)) {
            this.items.push(product);
            this.events.emit('basket:changed');
        }
    }

    remove(product: IProduct): void {
        this.items = this.items.filter((item) => item.id !== product.id);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:changed');
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    has(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}

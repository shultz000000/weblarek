import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

/**
 * Каталог товаров: хранит все товары и товар для подробного просмотра
 */
export class ProductsModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;
        this.events.emit('preview:changed');
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}

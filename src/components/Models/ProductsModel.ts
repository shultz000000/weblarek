import { IProduct } from '../../types';

/**
 * Каталог товаров: хранит все товары и товар для подробного просмотра
 */
export class ProductsModel {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}

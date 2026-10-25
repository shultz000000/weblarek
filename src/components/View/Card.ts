import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { categoryMap, settings } from '../../utils/constants';

/**
 * Родительский класс карточек товара: название и цена
 */
export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null
            ? settings.pricelessText
            : `${value} ${settings.currency}`;
    }

    // Выводит категорию и устанавливает модификатор фона из categoryMap
    protected setCategory(element: HTMLElement, value: string) {
        element.textContent = value;
        for (const [name, modifier] of Object.entries(categoryMap)) {
            element.classList.toggle(modifier, name === value);
        }
    }
}

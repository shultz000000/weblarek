import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IHeader } from '../../types';
import { ensureElement } from '../../utils/utils';

/**
 * Шапка страницы: кнопка корзины и счётчик товаров
 */
export class Header extends Component<IHeader> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}

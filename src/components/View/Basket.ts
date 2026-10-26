import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasket } from '../../types';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';

/**
 * Содержимое корзины
 */
export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} ${settings.currency}`;
    }

    set buttonDisabled(value: boolean) {
        this.orderButton.disabled = value;
    }
}

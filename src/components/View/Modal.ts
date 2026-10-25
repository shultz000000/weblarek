import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';

/**
 * Модальное окно: отображает переданный контент
 */
export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        // Клик по затемнённой области вокруг окна
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add(settings.modalActiveClass);
    }

    close(): void {
        this.container.classList.remove(settings.modalActiveClass);
    }
}

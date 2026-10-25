import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { TFormChange } from '../../types';
import { ensureElement } from '../../utils/utils';

/**
 * Родительский класс форм: кнопка отправки, ошибки, ввод и отправка
 */
export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLFormElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            this.events.emit<TFormChange>('form:change', {
                field: target.name as TFormChange['field'],
                value: target.value,
            });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}

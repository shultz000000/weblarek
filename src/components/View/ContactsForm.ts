import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TContactsForm } from '../../types';
import { ensureElement } from '../../utils/utils';

/**
 * Второй шаг оформления: почта и телефон
 */
export class ContactsForm extends Form<TContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}

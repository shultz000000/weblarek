import { Card } from './Card';
import { ICardActions, TCardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

/**
 * Карточка товара для подробного просмотра в модальном окне
 */
export class CardPreview extends Card<TCardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}

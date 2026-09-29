import { IBuyer, TBuyerErrors, TPayment } from '../../types';

/**
 * Покупатель: хранит и проверяет данные для оформления заказа
 */
export class BuyerModel {
    protected payment: TPayment | '' = '';
    protected address = '';
    protected email = '';
    protected phone = '';

    // Сохраняет только переданные поля, остальные не меняются
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    // Возвращает объект с ошибками; валидные поля в него не попадают
    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address) errors.address = 'Необходимо указать адрес';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';

        return errors;
    }
}
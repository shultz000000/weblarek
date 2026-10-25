export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Способ оплаты: онлайн или при получении
export type TPayment = 'card' | 'cash';

// Товар
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Покупатель
export interface IBuyer {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}

// Ошибки валидации данных покупателя
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Ответ сервера со списком товаров
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

// Данные заказа для отправки на сервер
export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

// Ответ сервера на оформление заказа
export interface IOrderResult {
    id: string;
    total: number;
}
// ---------- Данные для отображения (слой View) ----------

export interface IHeader {
    counter: number;
}

export interface IGallery {
    catalog: HTMLElement[];
}

export interface IModal {
    content: HTMLElement;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export type TCard = Pick<IProduct, 'title' | 'price'>;

export type TCardCatalog = TCard & Pick<IProduct, 'image' | 'category'>;

export type TCardPreview = TCardCatalog & Pick<IProduct, 'description'> & {
    buttonText: string;
    buttonDisabled: boolean;
};

export type TCardBasket = TCard & {
    index: number;
};

export interface IBasket {
    items: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}

export interface IForm {
    valid: boolean;
    errors: string;
}

export type TOrderForm = IForm & Pick<IBuyer, 'payment' | 'address'>;

export type TContactsForm = IForm & Pick<IBuyer, 'email' | 'phone'>;

export interface ISuccess {
    total: number;
}

// Данные события изменения поля формы
export type TFormChange = {
    field: keyof IBuyer;
    value: string;
};

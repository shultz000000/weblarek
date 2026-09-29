export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Способ оплаты: онлайн, при получении или ещё не выбран
export type TPayment = 'card' | 'cash' | '';

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
    payment: TPayment;
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
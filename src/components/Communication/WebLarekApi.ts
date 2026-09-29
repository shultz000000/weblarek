import { IApi, IOrder, IOrderResult, IProductsResponse } from '../../types';

/**
 * Слой коммуникации: получение товаров с сервера и отправка заказа
 */
export class WebLarekApi {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    // GET /product/ — объект с общим количеством и массивом товаров
    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    // POST /order/ — отправка заказа, в ответ id заказа и списанная сумма
    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}

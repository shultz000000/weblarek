import './scss/styles.scss';

import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { Api } from './components/base/Api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

// ---------- Каталог товаров ----------
const productsModel = new ProductsModel();
productsModel.setItems(apiProducts.items);

console.log('Каталог: массив товаров', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
console.log('Каталог: товар по id', productsModel.getItem(firstProduct.id));
console.log('Каталог: товар по несуществующему id', productsModel.getItem('no-such-id'));

console.log('Каталог: товар для просмотра до выбора', productsModel.getPreview());
productsModel.setPreview(firstProduct);
console.log('Каталог: товар для просмотра после выбора', productsModel.getPreview());

// ---------- Корзина ----------
const basketModel = new BasketModel();
const [product1, product2, product3] = productsModel.getItems();

basketModel.add(product1);
basketModel.add(product2);
basketModel.add(product3); // товар без цены
basketModel.add(product1); // повторно — не должен добавиться
console.log('Корзина: товары после добавления', basketModel.getItems());
console.log('Корзина: количество товаров', basketModel.getCount());
console.log('Корзина: общая стоимость', basketModel.getTotal());
console.log('Корзина: есть ли товар 1', basketModel.has(product1.id));

basketModel.remove(product1);
console.log('Корзина: товары после удаления товара 1', basketModel.getItems());
console.log('Корзина: есть ли товар 1 после удаления', basketModel.has(product1.id));
console.log('Корзина: стоимость после удаления', basketModel.getTotal());

basketModel.clear();
console.log('Корзина: товары после очистки', basketModel.getItems());
console.log('Корзина: количество после очистки', basketModel.getCount());

// ---------- Покупатель ----------
const buyerModel = new BuyerModel();

console.log('Покупатель: ошибки пустой формы', buyerModel.validate());

buyerModel.setData({ payment: 'card' });
buyerModel.setData({ address: 'г. Москва, ул. Пушкина, д. 1' });
console.log('Покупатель: данные после ввода оплаты и адреса', buyerModel.getData());
console.log('Покупатель: ошибки после первого шага', buyerModel.validate());

buyerModel.setData({ email: 'test@test.ru', phone: '+7 999 123-45-67' });
console.log('Покупатель: все данные', buyerModel.getData());
console.log('Покупатель: ошибки заполненной формы', buyerModel.validate());

buyerModel.clear();
console.log('Покупатель: данные после очистки', buyerModel.getData());

// ---------- Получение каталога с сервера ----------
const webLarekApi = new WebLarekApi(new Api(API_URL));

webLarekApi
    .getProducts()
    .then((data) => {
        productsModel.setItems(data.items);
        console.log('Сервер: каталог сохранён в модели', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Сервер: ошибка загрузки каталога', error);
    });

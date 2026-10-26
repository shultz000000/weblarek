import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { ProductsModel } from './components/Models/ProductsModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { IBasket, IOrder, IProduct, TContactsForm, TFormChange, TOrderForm } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// ---------- Шаблоны ----------
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// ---------- Брокер событий, API и модели данных ----------
const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// ---------- Компоненты представления ----------
const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const cardPreview = new CardPreview(events, cloneTemplate(cardPreviewTemplate));
const basketView = new Basket(events, cloneTemplate(basketTemplate));
const orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate<HTMLFormElement>(contactsTemplate));
const success = new Success(events, cloneTemplate(successTemplate));

// ---------- Подготовка данных для представлений ----------

// Карточки товаров в корзине
function getBasketCards(): HTMLElement[] {
    return basketModel.getItems().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket-item:delete-click', item),
        });
        return card.render({ title: item.title, price: item.price, index: index + 1 });
    });
}

// Данные для отрисовки корзины
function getBasketData(): IBasket {
    return {
        items: getBasketCards(),
        total: basketModel.getTotal(),
        buttonDisabled: basketModel.getCount() === 0,
    };
}

// Данные для формы способа оплаты и адреса
function getOrderFormData(): TOrderForm {
    const { payment, address } = buyerModel.getData();
    const errors = buyerModel.validate();
    return {
        payment,
        address,
        valid: !errors.payment && !errors.address,
        errors: [errors.payment, errors.address].filter(Boolean).join(settings.errorsSeparator),
    };
}

// Данные для формы почты и телефона
function getContactsFormData(): TContactsForm {
    const { email, phone } = buyerModel.getData();
    const errors = buyerModel.validate();
    return {
        email,
        phone,
        valid: !errors.email && !errors.phone,
        errors: [errors.email, errors.phone].filter(Boolean).join(settings.errorsSeparator),
    };
}

// ---------- События моделей данных ----------

// Изменился каталог: выводим карточки на главной странице
events.on('catalog:changed', () => {
    const cards = productsModel.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
        });
    });

    gallery.render({ catalog: cards });
});

// Изменился товар для просмотра: открываем его в модальном окне
events.on('preview:changed', () => {
    const product = productsModel.getPreview();
    if (!product) return;

    let buttonText = settings.buyButtonText;
    if (product.price === null) {
        buttonText = settings.unavailableButtonText;
    } else if (basketModel.has(product.id)) {
        buttonText = settings.removeButtonText;
    }

    modal.render({
        content: cardPreview.render({
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description,
            buttonText,
            buttonDisabled: product.price === null,
        }),
    });
    modal.open();
});

// Изменилась корзина: обновляем счётчик в шапке и содержимое корзины
events.on('basket:changed', () => {
    header.render({ counter: basketModel.getCount() });
    basketView.render(getBasketData());
});

// Изменились данные покупателя: обновляем формы и ошибки валидации
events.on('buyer:changed', () => {
    orderForm.render(getOrderFormData());
    contactsForm.render(getContactsFormData());
});

// ---------- События представлений ----------

// Выбрана карточка в каталоге
events.on('card:select', (product: IProduct) => {
    productsModel.setPreview(product);
});

// Нажата кнопка в карточке подробного просмотра: добавляем или удаляем товар
events.on('preview:button-click', () => {
    const product = productsModel.getPreview();
    if (!product) return;

    if (basketModel.has(product.id)) {
        basketModel.remove(product);
    } else {
        basketModel.add(product);
    }
    modal.close();
});

// Нажата кнопка удаления товара в корзине
events.on('basket-item:delete-click', (product: IProduct) => {
    basketModel.remove(product);
});

// Нажата кнопка открытия корзины
events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
    modal.open();
});

// Нажата кнопка «Оформить» в корзине
events.on('basket:order', () => {
    modal.render({ content: orderForm.render() });
    modal.open();
});

// Изменены данные в форме
events.on('form:change', (data: TFormChange) => {
    buyerModel.setData(data);
});

// Отправлена первая форма: переходим ко второй
events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

// Отправлена вторая форма: оформляем заказ на сервере
events.on('contacts:submit', () => {
    const order: IOrder = {
        ...buyerModel.getData(),
        total: basketModel.getTotal(),
        items: basketModel.getItems().map((item) => item.id),
    };

    webLarekApi
        .createOrder(order)
        .then((result) => {
            basketModel.clear();
            buyerModel.clear();
            modal.render({ content: success.render({ total: result.total }) });
            modal.open();
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа', error);
        });
});

// Нажата кнопка закрытия сообщения об успешном заказе
events.on('success:close', () => {
    modal.close();
});

// Закрытие модального окна крестиком или кликом вне окна
events.on('modal:close', () => {
    modal.close();
});

// ---------- Начальное состояние ----------
// События моделей выполнят начальный рендер счётчика, корзины и форм
basketModel.clear();
buyerModel.clear();

// ---------- Загрузка каталога с сервера ----------
webLarekApi
    .getProducts()
    .then((data) => {
        productsModel.setItems(data.items);
    })
    .catch((error) => {
        console.error('Ошибка загрузки каталога', error);
    });

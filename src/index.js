const basicSalesTaxRate = 0.1;
const importDutyRate = 0.05;
const exceptions = ['book', 'food', 'medical'];

function price({ price = 0 }) {
    return price;
}

function total({ total = 0 }) {
    return total;
}

function quantity({ quantity = 1 }) {
    return quantity;
}

function items({ items = [] }) {
    return items;
}

function salesTax({ salesTax = 0}) {
    return salesTax;
}

function roundToNearestFiveCents(num) {
    const cleaned = Number(withTwoDecimals(num));
    const remainder = Number(withTwoDecimals(cleaned % 0.1));

    if (remainder > 0.05 || remainder <= 0) return num;

    return Number(withTwoDecimals(cleaned + (0.05 - remainder)));
}

function withTwoDecimals(aFloat = 0) {
    return aFloat.toFixed(2);
}

function baseSalesTax(aBasketItem) {
    return !exceptions.includes(aBasketItem.type)
        ? (roundToNearestFiveCents(price(aBasketItem) * basicSalesTaxRate) * quantity(aBasketItem)) : 0;
}

function cost(aBasketItem) {
    return price(aBasketItem) * quantity(aBasketItem);
}

function importDuty(aBasketItem) {
    return aBasketItem.imported ? roundToNearestFiveCents(price(aBasketItem) * importDutyRate) : 0;
}

function order(aBasket) {
    return aBasket.reduce(toOrder, {});
}

function item(aBasketItem) {
    // price * importRate
    // 11.25 * 0.05
    // 0.5625 = importTax
    // cost = importTax + price
    // (11.25 * 0.05) + 11.25
    // 11.8125 = cost
    // 11.85 = rounded(cost)
    // 11.85 * 3
    // 35.55 = rounded(cost) * quantity
    // this only works for the basket 3 case

    const baseTax = baseSalesTax(aBasketItem);
    const importTax = importDuty(aBasketItem);
    const salesTax = roundToNearestFiveCents((baseTax + importTax) * quantity(aBasketItem));
    const total = salesTax + cost(aBasketItem);

    return {
        ...aBasketItem,
        salesTax,
        total
    };
}

function receiptLineItem(anItem) {
    const imported = anItem.imported ? ' imported' : '';

    return `${anItem.quantity}${imported} ${anItem.description}: ${receiptTotal(anItem)}`;
}

function receiptSalesTaxes({ salesTaxes = 0 }) {
    return withTwoDecimals(salesTaxes);
}

function receiptTotal(anOrder) {
    return withTwoDecimals(roundToNearestFiveCents(total(anOrder)));
}

function toOrder(anOrder, aBasketItem) {
    const partialItems = items(anOrder);
    const allOrderItems = [...partialItems, item(aBasketItem)];
    const salesTaxes = allOrderItems.reduce(toSalesTaxes, 0);
    const total = allOrderItems.reduce(toSubtotal, 0);

    return {
        ...anOrder,
        items: allOrderItems,
        salesTaxes,
        total
    };
}

function toSalesTaxes(salesTaxes, anItem) {
    return roundToNearestFiveCents(salesTaxes + salesTax(anItem));
}

function toSubtotal(subtotal, aLineItem) {
    return subtotal + total(aLineItem);
}

function printedReceipt(anOrder) {
    return (
        `
${items(anOrder).map(receiptLineItem).join('\n')}
Sales Taxes: ${receiptSalesTaxes(anOrder)}
Total: ${receiptTotal(anOrder)}
        `
    );
}

function receipt(aBasket) {
    return printedReceipt(order(aBasket));
}

module.exports = { receipt };


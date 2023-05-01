const basicSalesTaxRate = 10;
const importDutyRate = 5;
const exceptions = ['book', 'food', 'medical'];

// Map primitives to function values
function price(aBasket) {
    return aBasket.price || 0;
}

function total({ total = 0 }) {
    return total;
}

function quantity({ quantity = 1 }) {
    return quantity;
}

function orderItems({ items = [] }) {
    return items;
}

function salesTaxes({ salesTaxes = 0 }) {
    return salesTaxes;
}

/*
 * Business Rules
 */
function itemTotal(aBasket) {
    return price(aBasket) * quantity(aBasket);
}

function itemSaleTax(aBasket) {
    return 
}

function taxes({ salesTax = 0, importDuty = 0 }) {
    return salesTax + importDuty;
}

function roundedSalesTax(aSalesTax) {
    return roundTo5centsUp(aSalesTax);
}

function roundTo5centsUp(aValue) {
    return Math.ceil(aValue / 0.05) * 0.05;
}

function withTwoDigits(aFloat) {
    return aFloat.toFixed(2);
}

function salesTax(aGood) {
    return !exceptions.includes(aGood.type) ? (roundedSalesTax(itemTotal(aGood) * basicSalesTaxRate / 100)) : 0
}

function importDuty(aGood) {
    return aGood.imported ? ((itemTotal(aGood) * importDutyRate)/100) : 0;
}

function orderItem(aBasketItem) {
    const totalBaseTax = salesTax(aBasketItem) * quantity(aBasketItem);
    const total = itemTotal(aBasketItem) + totalBaseTax + importDuty(aBasketItem);
    const aSalesTax = roundedSalesTax(totalBaseTax + importDuty(aBasketItem));
    
    return {
        ...aBasketItem,
        total,
        salesTax: aSalesTax
    };
}

function receiptLineItem(anItem) {
    const imported = anItem.imported ? ' imported' : '';

    return `${anItem.quantity}${imported} ${anItem.description}: ${receiptTotal(anItem)}`;
}

function toOrder(anOrder, aBasketItem) {
    const partialItems = orderItems(anOrder);
    const allOrderItems = [...partialItems, orderItem(aBasketItem)];
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
    return salesTaxes + salesTax(anItem) + importDuty(anItem);
}

function toSubtotal(subtotal, aLineItem) {
    return subtotal + total(aLineItem);
}

function toTotal(partialTotal, aGood) {
    return partialTotal + salesTax(aGood) + importDuty(aGood) + itemTotal(aGood);
}

function receiptSalesTaxes(anOrder) {
    return withTwoDigits(roundedSalesTax(anOrder));
}

function receiptTotal(anOrder) {
    return withTwoDigits(total(anOrder));
}

// todo: round rule for calculated amounts
// todo: calculate quantity * unityPrice + baseTax = base price before apply import duty

function receipt(aBasket) {
    const anOrder = aBasket.reduce(toOrder, {});

    // Why so ugly? :)
    return `
${orderItems(anOrder).map(receiptLineItem).join('\n')}
Sales Taxes: ${receiptSalesTaxes(anOrder)}
Total: ${receiptTotal(anOrder)}`;
}


/*
 * Startup
 */

const basket1 = [
    {
        type: 'book',
        description: 'book',
        quantity: 2,
        price: 12.49
    },
    {
        type: 'music',
        description: 'music CD',
        quantity: 1,
        price: 14.99
    },
    {
        type: 'food',
        description: 'chocolate bar',
        quantity: 1,
        price: 0.85
    }
];

const basket2 = [
    {
        type: 'food',
        description: 'box of chocolates',
        imported: true,
        quantity: 1,
        price: 10.00
    },
    {
        type: 'cosmetic',
        description: 'bottle of perfume',
        imported: true,
        quantity: 1,
        price: 47.50
    }
]

const basket3 = [
    {
        type: 'cosmetic',
        description: 'bottle of perfume',
        imported: true,
        quantity: 1,
        price: 27.99
    },
    {
        type: 'cosmetic',
        description: 'bottle of perfume',
        imported: false,
        quantity: 1,
        price: 18.99
    },
    {
        type: 'medical',
        description: 'packet of headache pills',
        imported: false,
        quantity: 1,
        price: 9.75
    },
    {
        type: 'food',
        description: 'box of chocolates',
        imported: true,
        quantity: 3,
        price: 11.25
    },
]

console.log(receipt(basket1));
console.log(receipt(basket2));
console.log(receipt(basket3));

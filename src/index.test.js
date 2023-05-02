const { receipt } = require('./index');

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

const receipt1 = `
2 book: 24.98
1 music CD: 16.49
1 chocolate bar: 0.85
Sales Taxes: 1.50
Total: 42.35
`;

const receipt2 = `
1 imported box of chocolates: 10.50
1 imported bottle of perfume: 54.65
Sales Taxes: 7.65
Total: 65.15
`;

const receipt3 = `
1 imported bottle of perfume: 32.19
1 bottle of perfume: 20.89
1 packet of headache pills: 9.75
3 imported box of chocolates: 35.55
Sales Taxes: 7.90
Total: 98.38
`;

test('generate receipts for basket1', () => {
  expect((receipt(basket1)).trim()).toBe(receipt1.trim());
});

test('generate receipts for basket2', () => {
  expect((receipt(basket2)).trim()).toBe(receipt2.trim());
});

test('generate receipts for basket3', () => {
  expect((receipt(basket3)).trim()).toBe(receipt3.trim());
});
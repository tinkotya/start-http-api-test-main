import { describe, expect, test } from '@jest/globals'
// eslint-disable-next-line no-unused-vars
import { nameIsValid, fullTrim, getTotal } from '../src/app.js'

describe ("длина имени", () => {
  it("длина имени больше или равна двум", ()=>{
    expect(nameIsValid('Sasha')).toBe(true);
    expect(nameIsValid("S")).toBe(false);
  });
});

describe ("наличие пробела в имени", () => {
  it("наличие пробела в имени", ()=>{
    expect(nameIsValid('Sasha ')).toBe(false);
  });
});

describe ("пустая строка вместо имени", () => {
  it("пустая строка вместо имени", ()=>{
    expect(nameIsValid(null)).toBe(false);
  });
});

describe ("Удаление пробелов из строки", () => {
  it("удаляются пробелы", ()=>{
    expect(fullTrim('Sasha ')).toBe('Sasha');
    expect(fullTrim("S ")).toBe('S');
    expect(fullTrim(' S a  sh a\t ')).toBe('Sasha');
  });
});

describe ("Расчет стоимости товара со скидкой", () => {
  it("Передача в скидку строки возвращает ошибку", ()=>{
    expect(()=>getTotal([], '')).toThrowError('Скидка должна быть числом');
  });
  it("Верный расчёт с одним товаром без скидки", ()=>{
    expect(getTotal([{price: 400, quantity: 1}], 0)).toBe(400);
  })
  it("Верный расчёт с двумя товарами без скидки", ()=>{
    expect(getTotal([{price: 200, quantity: 2}], 0)).toBe(400);
  })
  it("Верный расчёт с одним товаром со скидкой 10%", ()=>{
    expect(getTotal([{price: 200, quantity: 1}], 10)).toBe(180);
  })
});

describe("проверка стоимости товара с учетом скидки, кол-ва и цены",()=>{
  test.each`
    price  | quantity | discount | expected
    ${200} | ${1}     | ${10}    | ${180}
  `(
    "возвращает сумму $expected когда товары по цене $price в кол-ве $quantity имеют скидку $discount",
    ({ price, quantity, discount, expected }) => {
      expect(getTotal([{ price, quantity }], discount)).toBe(expected);
    }
  );
})
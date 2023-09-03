import supertest from "supertest";
import user from "./helper/user";
import config from "./config";

describe('user', () => {
  let client 
  let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
  })
  describe('POST /swagger/#/Account/AccountV1AuthorizedPost', () => {
    test('Метод должен существовать', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send({
            "userName": "string",
            "password": "string"
          })
      expect(res.status).toEqual(404);
    })

    test('Авторизация должна проходить успешно с правильным логином и паролем', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send(config.credentials)
      expect(res.status).toEqual(200);
    })

    test('Авторизация должна возвращать статус с кодом ошибки если логин неверный', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send({
                "userName": "tinkoty", 
                "password": "Tinkotya@19071997"
              })
      expect(res.status).toEqual(404);
      })
    })

    test('Авторизация должна возвращать статус с кодом ошибки если пароль неверный', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send({
                "userName": "tinkotya", 
                "password": "Tinkotya19071997"
              })
      expect(res.status).toEqual(404);
    })
  })
  /*describe('Генерация токена', () =>{
    let client 
    let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
  })
  describe('Генерация токена', () =>{
    test('Генерация токена с ошибкой', async () => {
      const res = await client
          .post(`/Account/v1/GenerateToken`)
          .send()
      expect(res.status).toEqual(400);
    }),
    test('Генерация токена успешно', async () => {
      const res = await client
          .post(`/Account/v1/GenerateToken`)
          .set("Content-Type", "application/json")
          .send(config.credentials)
      expect(res.status).toEqual(200);
    })
  })
})*/
  describe('GET #/Account/AccountV1UserByUserIdGet', () =>{
    let client 
    let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
  })
  describe('GET', () =>{
    test('нельзя получить информацию о пользователе без авторизации', async () => {
      const res = await client
          .get(`/Account/v1/User/${config.uuid}`)
          .set("Content-Type", "application/json")
          .send()
      expect(res.status).toEqual(401);
    }),
    test('Успешный запрос информации о пользователе', async () => {
      const res = await client
          .get(`/Account/v1/User/${config.uuid}`)
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send(config.uuid)
      expect(res.status).toEqual(200);
    })
  })
})
  describe('DELETE /AccountV1UserByUserIdDelete', () =>{
    let client 
    let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
    })
    test('ошибка в ответ на ввод спецсимволов', async()=>{
      const res = await client
          .delete(`/Account/v1/User/{?}`)
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send()
      expect(res.status).toEqual(200);
    })
    test('Успешное удаление пользователя', async()=>{
      const res = await client
          .delete(`/Account/V1/User/${config.uuid}`)
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send()
      expect(res.status).toEqual(200);
    })
    test('Нельзя удалить пользователя без авторизации', async()=>{
      const res = await client
          .delete(`/Account/V1/User/${config.uuid}`)
          .set("Content-Type", "application/json")
          .send()
      expect(res.status).toEqual(401);
    })
  })
//создание книги
 /* describe('books', () => {
    let client 
    let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
        test('успешное создание книги', async () => {
          const res = await client
              .post('/BookStoreV1Books')
              .set("Content-Type", "application/json")
              .set('authorization', `Basic ${token}`)
              .send({})
    
          expect(res.status).toEqual(200);
        })
        test('ошибка 400 хз что нужно сделать', async () => {
          const res = await client
              .post('/BookStoreV1Books')
              .set("Content-Type", "application/json")
              .set('authorization', `Basic ${token}`)
              .send({})
    
          expect(res.status).toEqual(400);
        })
        test('книга не создается без авторизации', async () => {
          const res = await client
              .post('/BookStoreV1Books')
              .set("Content-Type", "application/json")
              .set('authorization', `Basic ${token}`)
              .send({})
    
          expect(res.status).toEqual(401);
        })
      })
    })

//редактирование книги
describe('PUT /swagger/#/BookStore/BookStoreV1BooksByISBNPut', () => {
    let client 
    let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
    test('Метод должен существовать', async () => {
      const res = await client
          .put('/BookStoreV1BooksByISBN')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send({})
      expect(res.status).not.toEqual(404);
  })
    test('успешное редактирование книги', async () => {
      const res = await client
          .put('/BookStoreV1BooksByISBN')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send({})

      expect(res.status).toEqual(200);
    })
    test('ошибка 400 хз что нужно сделать', async () => {
      const res = await client
          .put('/BookStoreV1BooksByISBN')
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send({})

      expect(res.status).toEqual(400);
    })
    test('книга не редактируется без авторизации', async () => {
      const res = await client
          .put('/BookStoreV1BooksByISBN')
          .set("Content-Type", "application/json")
          .send({})

      expect(res.status).toEqual(401);
    })
  })
})

describe('GET /swagger/#/BookStore/BookStoreV1BookGet', () =>{
    let client 
    let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
  test('запрос информации о книге', async()=>{
    const res = await client
        .get('')
        .set("Content-Type", "application/json")
        .set('authorization', `Basic ${token}`)
        .send({})
    expect(res.status).toEqual(200);
  })
  test('книга не найдена', async () => {
    const res = await client
        .get('')
        .set("Content-Type", "application/json")
        .set('authorization', `Basic ${token}`)
        .send({})
    expect(res.status).toEqual(400);
  })
})
})

        describe('DELETE /swagger/#/BookStore/BookStoreV1BookDelete', () =>{
          let client 
          let token
        beforeAll(async()=>{
          token = await user.getAuthToken()
          client = supertest(config.url)

          test('успешное удаление книги', async()=>{
            const res = await client
              .delete('/BookStoreV1BookDelete')
              .set("Content-Type", "application/json")
              .set("authorization", `Basic ${token}`)
              .send({});
            expect(res.status).toEqual(204);
          })
          test('ошибка 400 хз как вызвать', async () => {
            const res = await client
              .delete('/BookStoreV1BookDelete')
              .set("Content-Type", "application/json")
              .set("authorization", `Basic ${token}`)
              .send({});
            expect(res.status).toEqual(400);
        })
          test('книга не удаляется без авторизации', async () => {
            const res = await client
                .delete('/BookStoreV1BookDelete')
                .set("Content-Type", "application/json")
                .send({})
            expect(res.status).toEqual(401);
        })
      })
    })*/
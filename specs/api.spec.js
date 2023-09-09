import supertest from "supertest";
import user from "../framework/services/user";
import config from "../framework/config";

describe('user', () => {
  let client 
  let token
  beforeAll(async()=>{
    token = await user.getAuthToken()
    client = supertest(config.url)
  })
  describe('POST /Account/v1/Authorized', () => {
    test('Авторизация должна проходить успешно с правильным логином и паролем', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .send(config.credentials)
      expect(res.status).toEqual(200);
      expect(res.body).toEqual(true);
    })

    test('Авторизация должна возвращать статус с кодом ошибки если логин неверный', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .send({
            userName: "tinkoty",
            password: `${config.credentials.password}`,
              })
      expect(res.status).toEqual(404);
      expect(res.body.result).toEqual({
        "code": "1207",
        "message": "User not found!"
      });
      })
    })

    test('Авторизация должна возвращать статус с кодом ошибки если пароль неверный', async () => {
      const res = await client
          .post('/Account/v1/Authorized')
          .set("Content-Type", "application/json")
          .send({
            userName: `${config.credentials.userName}`, 
            password: "Tinkotya19071997",
              })
      expect(res.status).toEqual(404);
      expect(res.body.result).toEqual({
        "code": "1207",
        "message": "User not found!"
      });
    })
  })
  describe("POST /Account/v1/GenerateToken", () => {
     test("Возвращает ошибку если передали неверные лог/пасс", async () => {
       const res = await client
         .post(`/Account/v1/GenerateToken`)
         .set("Content-Type", "application/json")
         .send({
           userName: "userName",
           password: "password",
         });
       expect(res.status).toEqual(200);
       expect(res.body.token).toEqual(null);
       expect(res.body.result).toEqual("User authorization failed.");
     });
    
     test("Генерация токена успешно", async () => {
       const res = await client
         .post(`/Account/v1/GenerateToken`)
         .set("Content-Type", "application/json")
         .send(config.credentials);
       expect(res.status).toEqual(200);
     });
   });
  describe('GET /Account/v1/User/{uuid}', () =>{
    test('нельзя получить информацию о пользователе без авторизации', async () => {
      const res = await client
          .get(`/Account/v1/User/${config.uuid}`)
          .set("Content-Type", "application/json")
          .send()
      expect(res.status).toEqual(401);
      expect(res.body.result).toEqual({
        "code": "1207",
        "message": "User not authorized!"
      });
    }),
    test('Успешный запрос информации о пользователе', async () => {
      const res = await client
          .get(`/Account/v1/User/${config.uuid}`)
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send()
      expect(res.status).toEqual(200);
      expect(res.status).toEqual(
        {
          "userId": `${config.uuid}`,
          "username": `${config.credentials.userName}`,
          "books": []
      }
      );
    })
  })

  describe('DELETE /Account/v1/User', () =>{
    test('ошибка в ответ на ввод спецсимволов', async()=>{
      const res = await client
          .delete(`/Account/v1/User/{?}`)
          .set("Content-Type", "application/json")
          .set('authorization', `Basic ${token}`)
          .send()
      expect(res.status).toEqual(200);
      expect(res.body.result).toEqual({
        "code": "1207",
        "message": "User Id not correct!"
      });
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
      expect(res.body.result).toEqual({
        "code": "1207",
        "message": "User not authorized!"
      });
    })
  })

/*describe("POST", () => {
  let client;
  let token;

  beforeAll(async () => {
    token = await user.getAuthToken();
    client = supertest(config.url)
  })
    test("успешное создание книги", async () => {
      const res = await client
        .post("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send({
          "userId": `${config.uuid}`,
          "collectionOfIsbns": [
            {
              "isbn": "string1234"
            }
          ]
        });

      expect(res.status).toEqual(200);
    });
    test("ошибка 400", async () => {
      const res = await client
        .post("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send({
          "userId": `${config.uuid}`,
          "collectionOfIsbns": [
            {
              "isbn": "?"
            }
          ]
        });
      expect(res.status).toEqual(400);
    });
    test("книга не создается без авторизации", async () => {
      const res = await client
        .post("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .send({
          "userId": `${config.uuid}`,
          "collectionOfIsbns": [
            {
              "isbn": "string1234"
            }
          ]
        });
      expect(res.status).toEqual(401);
    });
  });

describe("PUT", () => { //здесь в сваггере 2 поля в запросе, а постмане одно, написала одно из постмана
  let client;
  let token;
  beforeAll(async () => {
    token = await user.getAuthToken();
    client = supertest(config.url);
    test("Метод должен существовать", async () => {
      const res = await client
        .put("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send();
      expect(res.status).not.toEqual(404);
    });
    test("успешное редактирование книги", async () => {
      const res = await client
        .put("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send({
          "userId": `${config.uuid}`,
          "isbn": "string"
        });
      expect(res.status).toEqual(200);
    });
    test("ошибка 400", async () => {
      const res = await client
        .put("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send({
          "userId": `${config.uuid}`,
          "isbn": "string"
        });
      expect(res.status).toEqual(400);
    });
    test("книга не редактируется без авторизации", async () => {
      const res = await client
        .put("/BookStore/V1/Books")
        .set("Content-Type", "application/json")
        .send({
          "userId": `${config.uuid}`,
          "isbn": "string"
        });
      expect(res.status).toEqual(401);
    });
  });
});

describe("GET", () => {
  let client;
  let token;
  beforeAll(async () => {
    token = await user.getAuthToken();
    client = supertest(config.url);
    test("запрос информации о книге", async () => {
      const res = await client
        .get("/BookStore/v1/Book/test")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send();
      expect(res.status).toEqual(200);
    });
    test("книга не найдена", async () => {
      const res = await client
        .get("/BookStore/v1/Book/") //не придумала что передать, постман на всё отдает 200, сваг на все 400
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send();
      expect(res.status).toEqual(400);
    });
  });
});

describe("DELETE /swagger/#/BookStore/BookStoreV1BookDelete", () => {
  let client;
  let token;
  beforeAll(async () => {
    token = await user.getAuthToken();
    client = supertest(config.url);

    test("успешное удаление книги", async () => {
      const res = await client
        .delete("/BookStore/V1/Book")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send({
          "isbn": "string",
          "userId": `${config.uuid}`
        });
      expect(res.status).toEqual(204);
    });
    test("ошибка 400, отправить не строку", async () => {
      const res = await client
        .delete("/BookStore/V1/Book")
        .set("Content-Type", "application/json")
        .set("authorization", `Basic ${token}`)
        .send({
          "isbn": "_?",
          "userId": `${config.uuid}`
        });
      expect(res.status).toEqual(400);
    });
    test("книга не удаляется без авторизации", async () => {
      const res = await client
        .delete("/BookStore/V1/Book")
        .set("Content-Type", "application/json")
        .send({
          "isbn": "string",
          "userId": `${config.uuid}`
        });
      expect(res.status).toEqual(401); //не понятно как вызвать такой ответ, в сваггере как будто он возникает без авторизации, тут авторизации нет и все же ответ 400
    });
  });
});*/

import request from "supertest";
import { app } from "../../app";

describe("signup route", () => {
  it("returns a 201 on successful signup", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "testmail@mail.com",
        password: "password",
      })
      .expect(201);
  });

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "testmail",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "p",
      })
      .expect(400);
  });

  it("returns a 400 with missing email and password", async () => {
    return request(app).post("/api/users/signup").send({}).expect(400);
  });
  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
      })
      .expect(400);
  });

  it("sets a cookie after successful signup", async () => {
    const response = await request(app).post("/api/users/signup").send({
      name: "test",
      email: "test@mail.com",
      password: "password",
    });
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("signin route", () => {
  it("returns a 200 on successful signin", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
      })
      .expect(201);

    return request(app)
      .post("/api/users/signin")
      .send({
        email: "test@mail.com",
        password: "password",
      })
      .expect(200);
  });

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({
        email: "testmail",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({
        email: "test@mail.com",
        password: "p",
      })
      .expect(400);
  });

  it("returns a 400 with missing email and password", async () => {
    return request(app).post("/api/users/signin").send({}).expect(400);
  });

  it("returns a 400 with incorrect email", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({
        email: "testmail@mail.com",
        password: "password",
      })
      .expect(400);
  });

  test("returns a 400 with incorrect password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
      })
      .expect(201);

    return request(app)
      .post("/api/users/signin")
      .send({
        email: "test@mail.com",
        password: "password1",
      })
      .expect(400);
  });

  it("sets a cookie after successful signin", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@mail.com",
        password: "password",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("signout route", () => {
  it("clears the cookie after signing out", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        name: "test",
        email: "test@mail.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("currentuser route", () => {
  it("responds with details about the current user", async () => {
    const cookie = await signinTestHelper();

    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie!)
      .send()
      .expect(200);

    expect(response.body.data.email).toEqual("test@mail.com");
  });

  it("responds with null if not authenticated", async () => {
    const response = await request(app)
      .get("/api/users/currentuser")
      .send()
      .expect(200);

    expect(response.body.data).toBeNull();
  });
});

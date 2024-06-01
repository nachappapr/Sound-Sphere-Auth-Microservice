import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

declare global {
  var signinTestHelper: () => Promise<string[] | undefined>;
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signinTestHelper = async () => {
  const name = "test";
  const email = "test@mail.com";
  const password = "password";
  const response = await request(app)
    .post("/api/users/signup")
    .send({ name, email, password })
    .expect(201);

  return response.get("Set-Cookie");
};

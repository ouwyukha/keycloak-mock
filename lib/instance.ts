import { JWK } from "node-jose";

import MockDatabase from "./database";

import createBearerToken from "./createBearerToken";
import { MockUserProfile, CreateMockUserProfileOptions } from "./database";

export interface CreateMockInstanceOptions {
  authServerURL: string;
  clientID: string;
  realm: string;
}

export interface MockInstanceParams {
  authServerURL: string;
  clientID: string;
  realm: string;
}

class MockInstance {
  store: JWK.KeyStore;
  defaultKey: JWK.Key;
  database: MockDatabase;
  params: MockInstanceParams;

  constructor(
    store: JWK.KeyStore,
    defaultKey: JWK.Key,
    database: MockDatabase,
    params: MockInstanceParams
  ) {
    this.store = store;
    this.defaultKey = defaultKey;
    this.database = database;
    this.params = params;
  }

  createBearerToken(sub: string, expiresIn: number = 3600): string {
    return createBearerToken({
      sub,
      key: this.defaultKey,
      expiresIn,
      realm: this.params.realm,
      clientID: this.params.clientID,
      authServerURL: this.params.authServerURL,
    });
  }
}

const createMockInstance = async (options: CreateMockInstanceOptions): Promise<MockInstance> => {
  const store = JWK.createKeyStore();
  const defaultKey = await store.generate("RSA", 2048, { use: "sig" });

  return new MockInstance(store, defaultKey, new MockDatabase(), {
    authServerURL: options.authServerURL,
    clientID: options.clientID,
    realm: options.realm,
  });
};

export { MockInstance, createMockInstance };
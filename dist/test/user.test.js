"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import request from 'supertest';
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(app_1.default);
// Your GraphQL queries and mutations can be defined here
const createUserMutation = `
  mutation {
    Signup(newUser: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password"
    }) {
      firstName
      lastName
      email
    }
  }
`;
const loginMutation = `
  mutation {
    Login(loginUser: {
      email: "johndoe@example.com",
      password: "password"
    }) {
      user {
        firstName
        lastName
        email
      }
      token
    }
  }
`;
const getAllUsersQuery = `
  query {
    getUsers {
      firstName
      lastName
      email
    }
  }
`;
const updateUserMutation = `
  mutation {
    UpdateUser(updateUser: {
      id: "user_id_here",
      firstName: "UpdatedFirstName"
    }) {
      firstName
      lastName
      email
    }
  }
`;
const deleteUserMutation = `
  mutation {
    DeleteUser(id: "user_id_here") {
      firstName
      lastName
      email
    }
  }
`;
const yourGraphQLQueryOrMutation = `
  // Your GraphQL query or mutation here
`;
describe('GraphQL API Tests', () => {
    it('should create a user', async () => {
        const response = await request.post('http://localhost:8081/graphql').send({ query: createUserMutation });
        expect(response.status).toBe(200);
        expect(Error).toBeFalsy(); // Check if there are no errors in the response
    });
    it('should log in a user', async () => {
        const response = await request.post('http://localhost:8081/graphql').send({ query: loginMutation });
        expect(response.status).toBe(200);
        // Add assertions for user login here
    });
    it('should get all users', async () => {
        const response = await request.post('http://localhost:8081/graphql').send({ query: getAllUsersQuery });
        expect(response.status).toBe(200);
        // Add assertions for getting all users here
    });
    it('should update a user', async () => {
        const response = await request.post('http://localhost:8081/graphql').send({ query: updateUserMutation });
        expect(response.status).toBe(200);
        // Add assertions for updating a user here
    });
    it('should delete a user', async () => {
        const response = await request.post('http://localhost:8081/graphql').send({ query: deleteUserMutation });
        expect(response.status).toBe(200);
        // Add assertions for deleting a user here
    });
    it('should perform your GraphQL query/mutation', async () => {
        const response = await request.post('http://localhost:8081/graphql').send({ query: yourGraphQLQueryOrMutation });
        expect(response.status).toBe(200);
        // Add assertions specific to your GraphQL query/mutation here
    });
});

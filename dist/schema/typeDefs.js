"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
    type User {
      id: ID!
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    }
    type Query {
        getUsers: [User!]!
        getUser(id: ID): User
    }
    
    
    input Signup {
        firstName: String!,
        lastName: String!,
        email: String!,
        password: String!,
    }
    
    input Login {
        email: String!
        password: String!
      }

      type AuthPayload {
        user: User!
        token: String!
      }
     
    input UpdateUserInput {
        id: ID!
        firstName: String
        lastName: String
        email: String
        password: String
      }
    
    type Mutation {
        Signup(newUser: Signup):User
        Login(loginUser: Login): AuthPayload!
        UpdateUser(updateUser: UpdateUserInput): User
        DeleteUser(id: ID!): User
        
    }
`;

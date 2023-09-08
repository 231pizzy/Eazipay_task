import express from "express"
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { resolvers } from './schema/resolvers'
import { typeDefs } from './schema/typeDefs'
import mongoose from "mongoose";
import { authenticateUser } from "./utilis/auth";

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://taskAndLearning:onGod@atlascluster.verf2tx.mongodb.net/learning")


mongoose.connection.on("connected", function () {
  console.log("database is connected");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    
    if(formattedError?.extensions?.code ===ApolloServerErrorCode.BAD_USER_INPUT) {
      return {
        message: formattedError.message,
      };
    }
    return {message: formattedError.message};
  }
});

(async ()=> {
  const { url } = await  startStandaloneServer(server, {
     listen: { port:8081 },
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
  
      if (token) {
        const user = await authenticateUser(token);
         return {user} ;
      }
      return new Error('no token found')
    },
  });
  
  console.log(`Server Running @ ${url}`);
})()

export default app;
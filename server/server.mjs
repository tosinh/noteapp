import express from 'express'
import http from 'http';
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import mongoose from 'mongoose';
import fakeData from './fakeData/index.js';

import { resolvers } from './resolvers/index.js'
import { typeDefs } from './schemas/index.js'
import './firebaseConfig.js'
import { getAuth } from 'firebase-admin/auth'

import 'dotenv/config.js'

const app = express()
const httpServer = http.createServer(app)


//connect to db
const URI = 'mongodb+srv://sinh:sing@cluster0.kzvyb3f.mongodb.net/?retryWrites=true&w=majority'
const PORT = process.env.PORT || 4000
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

const authorizationJWT = async (req, res, next) => {
  console.log({ authorization: req.headers.authorization });
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(' ')[1];

    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        console.log({ decodedToken });
        res.locals.uid = decodedToken.uid;
        next();
      })
      .catch((err) => {
        console.log({ err });
        return res.status(403).json({ message: 'Forbidden', error: err });
      });
  } else {
    // next();
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


app.use(cors(), bodyParser.json(), expressMiddleware(server, {
  context: async ({ req, res }) => {
    return { uid: res.locals.uid };
  },
}))


// mongoose.set('strictQuery', false);
// mongoose.connect(URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(async () => {
//     console.log('Connected to DB');
//     await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
//     console.log('http://localhost:4000');
//   });
mongoose.set('strictQuery', false);

mongoose.connect(URI)
  .then(async () => {
    console.log('Connected to DB');
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log('http://localhost:4000');
  });

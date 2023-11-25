import express from 'express'
import http from 'http';
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import mongoose from 'mongoose';
import fakeData from './fakeData/index.js';
import 'dotenv/config.js'

import { resolvers } from './resolvers/index.js'
import { typeDefs } from './schemas/index.js'

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

app.use(cors(), bodyParser.json(), expressMiddleware(server))


// async function startServer() {
//   await server.start();

//   app.use(cors(), bodyParser.json(), expressMiddleware(server));

//   mongoose.set('strictQuery', false);
//   mongoose.connect(URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//     .then(async () => {
//       console.log('Connected to DB');
//       await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
//       console.log(`Server is running at http://localhost:${PORT}`);
//     })
//     .catch(() => {
//       console.log('Lỗi')
//       return 0
//     });
// }

// startServer();
mongoose.set('strictQuery', false);
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to DB');
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log('http://localhost:4000');
  });

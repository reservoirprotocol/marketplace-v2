import {MongoClient, ServerApiVersion} from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string, {
  serverApi: ServerApiVersion.v1,
  //loggerLevel: 'debug',
  //logger: (message, context) => console.dir(context),
})

export default client.db("nftearth");
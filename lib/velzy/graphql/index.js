const generator = require("./generator");
const Velzy = require("../index");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema
} = require("graphql");
const {GraphQLDateTime} = require("graphql-iso-date");

// const { PostgresPubSub } = require("graphql-postgres-subscriptions");
// const { Client } = require('pg');


const { GraphQLJSON } = require("graphql-type-json");
const SearchResultType = new GraphQLObjectType({
  name: "SearchResult",
  fields: () => ({
    result: { type: GraphQLJSON },
    rank: { type: GraphQLFloat }
  })
});

const RecordType = new GraphQLObjectType({
  name: "Record",
  fields: () => ({
    id: { type: GraphQLInt },
    body: { type: GraphQLJSON },
    created_at: { type: GraphQLDateTime },
    updated_at: { type: GraphQLDateTime },
  })
});


const getRootMutation = (db) => ({
  name: "RootMutation",
  type: "Mutation",
  fields: {
    saveDocument: {
      type: GraphQLJSON,
      description: "This is the main way to get data into Velzy as it will create a document table for you on the fly",
      args: {
        collection: { type: GraphQLString },
        body: { type: GraphQLJSON }
      },
      resolve(_, args) {
        return db[args.collection].save(args.body);
      }
    }
  }
});

const getRootQuery = (db) => ({
  name: "RootQuery",
  type: "Query",
  fields: {
    tableList : {
      type: GraphQLJSON,
      description: "Get a list of all tables within Velzy",
      resolve(_, args){
        return db.tableList();
      }
    }
  }
});

exports.build = async function (db, cb = null){

  // const client = new Client({ connectionString: process.env.DATABASE_URL });
  // await client.connect();
  // const pubsub = new PostgresPubSub({ client });

  const tables = await db.getSampleSet();
  let rootQuery = getRootQuery(db);
  let rootMutation = getRootMutation(db);
  for (table of tables) {
    const type = generator.createTableType(table);
    const filterType = generator.createTableFilter(table);

    rootQuery = generator.createTableQueries(rootQuery, type, filterType, table, db);
    rootMutation = generator.createTableMutations(rootMutation, type, table, db);
  }
  const properRootQuery = new GraphQLObjectType(rootQuery);
  const properRootMutation = new GraphQLObjectType(rootMutation);
  //const subRoot = new GraphQLObjectType(getRootSubs(db));

  if(cb)cb({ query: properRootQuery, mutation: properRootMutation })
  return new GraphQLSchema({ query: properRootQuery, mutation: properRootMutation });
}

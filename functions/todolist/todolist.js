const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb');
const q = faunadb.query;
console.log('hi');
const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('todo_list'))),
            q.Lambda(x => q.Get(x))
          )
        );

        return result.data.map(d => {
          return {
            id: 1,
            task: 'asd',
            status: true
          }
        })
      }
      catch (err) {
        console.log(err);
      }
    },  
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

        const result = await client.query(
          q.Create(q.Collection('todo'),
            {
              data: {
                task: task,
                status: true
              }
            }
          )
        );
        console.log(result);
        return result.ref.data;
      }
      catch (err) {
        console.log(err);
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }

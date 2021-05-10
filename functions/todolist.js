const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb');
const q = faunadb.query;

var objToday = new Date(),
  weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayOfWeek = weekday[objToday.getDay()],
  dayOfMonth = objToday.getDate(),
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  curMonth = months[objToday.getMonth()],
  curYear = objToday.getFullYear(),
  curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
  curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
  curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds()

var today = curHour + ":" + curMinute + "." + curSeconds + " " + dayOfWeek.substring(0, 3) + " " + curMonth.substring(0, 3) + " " + dayOfMonth + " " + curYear;

const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
    date: String!
  }
  type Mutation {
    addTodo(task: String!): Todo
    delTodo(id: ID!): Todo
    updateTodo(id: ID!, task: String!): Todo
    checkTodo(id: ID!, status: Boolean!): Todo
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, { user }) => {
      if (!user) {
        return [];
      } else {
        try {
          const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

          const result = await client.query(
            q.Map(
              q.Paginate(q.Match(q.Index('todo_list'))),
              q.Lambda(x => q.Get(x))
            )
          );
          return result.data.reverse().map(d => {
            return {
              id: d.ref.id,
              task: d.data.task,
              status: d.data.status,
              date: d.data.date,
            }
          })
        }
        catch (err) {
          console.log(err);
        }
      }
    },
  },
  Mutation: {
    addTodo: async (_, { task }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to insert todos");
      }
      try {
        const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

        const result = await client.query(
          q.Create(q.Collection('todo'),
            {
              data: {
                task: task,
                status: false,
                date: today
              }
            }
          )
        );
        return result.ref.data
      }
      catch (err) {
        console.log(err);
      }
    },
    updateTodo: async (_, { id, task }) => {
      try {
        const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

        const result = await client.query(
          q.Update(q.Ref(q.Collection('todo'), id),
            {
              data: {
                task: task,
                date: today
              }
            }
          )
        );
        return result.ref.data
      }
      catch (err) {
        console.log(err);
      }
    },
    delTodo: async (_, { id }) => {
      try {
        const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

        const result = await client.query(
          q.Delete(q.Ref(q.Collection('todo'), id))
        );
      }
      catch (err) {
        console.log(err);
      }
    },
    checkTodo: async (_, { id, status }) => {
      try {
        const client = new faunadb.Client({ secret: "fnAEIslqRiACCEIQ8qnAeB0OxX0xpzz7cakZpbcw" });

        const result = await client.query(
          q.Update(q.Ref(q.Collection('todo'), id),
            {
              data: {
                status
              }
            }
          )
        );
        return result.ref.data
      }
      catch (err) {
        console.log(err);
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if (context.clientContext.user) {
      return { user: context.clientContext.user.sub };
    } else {
      return {};
    }
  },
});
exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
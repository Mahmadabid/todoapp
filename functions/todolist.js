const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;
require("dotenv").config();

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

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

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
    updateTodo(id: ID!, task: String!): Todo
    checkTodo(id: ID!, status: Boolean!): Todo
    delTodo(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    todos: async (parent, args, { user }) => {
      if (!user) {
        return [];
      } else {
        const results = await client.query(
          q.Paginate(q.Match(q.Index("todo_list"), user))
        );
        return results.data.map(([ref, task, status, date]) => {
          return {
            id: ref.id,
            task,
            status,
            date,
          };
        });
      }
    },
  },
  Mutation: {
    addTodo: async (_, { task }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to add todos");
      }
      const results = await client.query(
        q.Create(q.Collection("todo"), {
          data: {
            task,
            status: false,
            owner: user,
            date: today,
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
    updateTodo: async (_, { id, task }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to add todos");
      }
      const results = await client.query(
        q.Update(q.Ref(q.Collection("todo"), id), {
          data: {
            task,
            date: today,
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
    checkTodo: async (_, { id, status }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to add todos");
      }
      const results = await client.query(
        q.Update(q.Ref(q.Collection("todo"), id), {
          data: {
            status
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
    delTodo: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to delete todos");
      }
      const results = await client.query(
        q.Delete(q.Ref(q.Collection("todo"), id))
      );
    },
  },
};

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

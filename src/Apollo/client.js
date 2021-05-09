import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://ahm-todoapp.netlify.app/.netlify/functions/todolist',
    fetch,
  }),
  cache: new InMemoryCache()
});

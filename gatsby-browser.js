import React from 'react';
import { Provider } from 'react-redux';
import store from './src/Global/store';
import { Theme } from "./src/Global/theme";
import './src/Global/Global.css';
import { client } from "./src/Apollo/client";
import { ApolloProvider } from '@apollo/client';

export const wrapRootElement = ({ element }) => {
  
  return <ApolloProvider client={client}><Provider store={store}><Theme>{element}</Theme></Provider></ApolloProvider>;
};
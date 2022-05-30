import '@apollo-elements/components/apollo-client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { ApolloClientElement } from '@apollo-elements/components/apollo-client';

const link = new HttpLink({ uri: 'http://localhost:4000/graphql/' });
const cache = new InMemoryCache();
const client = new ApolloClient({ cache, link });

const clientWrapper = document.getElementById('client') as ApolloClientElement;
clientWrapper.client = client;

import '@lion/collapsible/define';
import './components/FlatEntry';
import './pages/MainPage';

// customElements
//   .whenDefined('main-page')
//   .then(() => document.body.removeAttribute('unresolved'));

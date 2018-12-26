import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import config from 'next/config';
const { publicRuntimeConfig } = config();
const { uri } = publicRuntimeConfig;

// Little type override hack to ensure we can attach the fetch property to the nodeJS global namespace/object
interface GlobalWithFetch extends NodeJS.Global {
  fetch?: any;
}
declare var global: GlobalWithFetch;

// Check whether this file is being called from the server or client(browser) context and set that to a const variable.
const isBrowser = typeof window !== 'undefined';

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  global.fetch = fetch;
}

const create = (initialState: {}) => {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState),
    connectToDevTools: isBrowser,
    link: new HttpLink({
      uri,
      // tslint:disable-next-line:object-literal-sort-keys
      credentials: 'include' // Additional fetch() options like `credentials` or `headers`
    }),
    ssrMode: !isBrowser // Disables forceFetch on the server (so queries are only run once)
  });
};

// Initialise the apolloClient variable outside the initApollo function so that it is not bound to the function scope and
// re-initialised every time the initApollo function runs (as it could run once on the server then another time on the client)
let apolloClient: ApolloClient<{}>;

/**
 * Initialise the Apollo Client we'll be using to make requests to a graphQL server (in our case Apollo Server)
 *
 * @param {any} initialState A state that can be passed from the server to the client to ensure the Apollo client's SSR run doesn't go unused
 * @returns {ApolloClient} The instance of ApolloClient to be used throughout our NextJS application
 */
const initApollo = (initialState: {} = {}): ApolloClient<typeof initialState> => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
};

export default initApollo;

import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // 根据后端地址修改
  cache: new InMemoryCache(),
})

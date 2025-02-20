import { ApolloClient, from } from '@apollo/client'
import { errorLink } from './errorHandler'
import { authLink } from './auth'

export const initApolloMiddleware = (client: ApolloClient<any>) => {
  client.setLink(
    from([
      authLink,
      errorLink,
      client.link // 保持原有 HTTP 链路
    ])
  )
}

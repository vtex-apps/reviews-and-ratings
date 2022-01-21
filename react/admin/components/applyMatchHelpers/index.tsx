import type { GraphQLError } from 'graphql'

export const getGraphQLErrorCode = (
  graphQLError: GraphQLError
): number | undefined => {
  return graphQLError?.extensions?.exception?.response?.data?.Error?.Code
}

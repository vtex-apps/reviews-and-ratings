import { path } from 'ramda'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getGraphQLErrorCode = (graphQLError: any): number | undefined =>
  path(
    ['extensions', 'exception', 'response', 'data', 'Error', 'Code'],
    graphQLError
  )

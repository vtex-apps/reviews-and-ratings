/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState, useEffect, Fragment } from 'react'
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import { Query, ObservableQueryFields } from 'react-apollo'
import { Button, EmptyState } from 'vtex.styleguide'
import { PersistedPaginatedTable } from 'vtex.paginated-table'
import { useRuntime } from 'vtex.render-runtime'

import { Review, SearchReviewArgs, SearchReviewData } from '../types'
import reviews from '../../../graphql/reviews.graphql'
import { tableQueryMessages, tableSearchMessages } from '../utils/messages'
import useSearch from './tableHelpers/useSearch'

const NETWORK_REFETCHING_STATUS = 4
const DEFAULT_TABLE_PAGE_TO = 15
const DEFAULT_TABLE_PAGE_FROM = 0
const DEFAULT_SORT_ORDER = 'DESC'

const orderByMap: any = {
  date: 'ReviewDateTime',
}

interface ReviewsTableProps {
  toRowData: (review: Review) => any
  reviewStatus: string
  schema: any
  lineActions?: any
  bulkActions?: any
  setTotal?: (total: number) => void
  emptyStateText?: string | JSX.Element
  filterOptionsLists?: {}
  children?: ({
    fetchMore,
    variables,
    table,
  }: {
    fetchMore: ObservableQueryFields<
      SearchReviewData,
      SearchReviewArgs
    >['fetchMore']
    variables: SearchReviewArgs
    table: JSX.Element
  }) => JSX.Element
}

export const ReviewsTable: FC<ReviewsTableProps & InjectedIntlProps> = ({
  intl,
  reviewStatus,
  toRowData,
  schema,
  bulkActions,
  lineActions,
  setTotal,
  // filterOptionsLists = {},
  children,
  emptyStateText,
}) => {
  const { query } = useRuntime()

  const [, forceUpdate] = useState()
  //   const [
  //     filterSchema,
  //     brandFilter,
  //     sellerFilter,
  //     categoryFilter,
  //   ] = usePersistedFilters({
  //     intl,
  //     ...filterOptionsLists,
  //   })
  const [
    { displayValue, searchValue },
    { onSearchChange, onSearchClear, onSearchSubmit },
  ] = useSearch()

  const to = query.to ? parseInt(query.to, 10) : DEFAULT_TABLE_PAGE_TO
  const from = query.from ? parseInt(query.from, 10) : DEFAULT_TABLE_PAGE_FROM
  const sortOrder = query.sortOrder ? query.sortOrder : DEFAULT_SORT_ORDER
  const sortBy = query.sortedBy

  useEffect(() => {
    forceUpdate({})
  }, [to, from, sortOrder, sortBy])

  const initialQueryVariables: SearchReviewArgs = {
    status: reviewStatus,
  }

  const refreshPage = () => window.location.reload()

  const emptyStateLabel = searchValue ? (
    <Fragment>
      <p className="ma0 tc">
        <FormattedMessage
          id="admin/reviews.table.empty-state.no-results"
          values={{
            searchValue: <span className="b">{searchValue}</span>,
          }}
        />
      </p>
      <p className="ma0 tc">
        <FormattedMessage id="admin/reviews.table.empty-state.check-spelling" />
      </p>
    </Fragment>
  ) : (
    emptyStateText
  )

  return (
    <Query<SearchReviewData, SearchReviewArgs>
      query={reviews}
      variables={{
        ...initialQueryVariables,
        searchTerm: searchValue,
        from,
        to,
        orderBy: sortBy
          ? `${orderByMap[sortBy]}:${sortOrder}`
          : 'ReviewDateTime:desc',
      }}
      notifyOnNetworkStatusChange
      fetchPolicy="cache-and-network"
    >
      {({ loading, error, data, fetchMore, networkStatus, variables }) => {
        if (data?.reviews?.range) {
          setTotal?.(data.reviews.range.total)
        }

        const errorState = (
          <div className="w-100 vh-50 flex items-center justify-center">
            <EmptyState>
              <FormattedMessage {...tableQueryMessages.errorFeedback} />
              <div className="pt5">
                <Button variation="primary" size="small" onClick={refreshPage}>
                  <span className="flex align-baseline">
                    <FormattedMessage id="admin/reviews.table.error.refreshButton" />
                  </span>
                </Button>
              </div>
            </EmptyState>
          </div>
        )

        const watchedVariablesString = `${searchValue}.${sortBy}.${sortOrder}`

        const table =
          error || (!loading && !data) ? (
            errorState
          ) : (
            <PersistedPaginatedTable
              items={
                data?.reviews?.data ? data.reviews.data.map(toRowData) : []
              }
              loading={
                (loading && networkStatus !== NETWORK_REFETCHING_STATUS) ||
                !data
              }
              schema={schema}
              emptyStateLabel=""
              emptyStateChildren={emptyStateLabel}
              toolbar={{
                inputSearch: {
                  value: displayValue || '',
                  placeholder: intl.formatMessage(
                    tableSearchMessages.placeholder
                  ),
                  onChange: onSearchChange,
                  onClear: onSearchClear,
                  onSubmit: onSearchSubmit,
                },
              }}
              onRowClick={() => {}}
              total={data?.reviews?.range ? data.reviews.range.total : 0}
              updatePaginationKey={watchedVariablesString}
              defaultElementsPerPage={DEFAULT_TABLE_PAGE_TO}
              defaultSortOrder={DEFAULT_SORT_ORDER}
              lineActions={lineActions}
              bulkActions={bulkActions}
              filters={null}
              dynamicRowHeight
            />
          )

        if (children && typeof children === 'function') {
          return children({ fetchMore, variables, table })
        }
        return table
      }}
    </Query>
  )
}

export default injectIntl(ReviewsTable)

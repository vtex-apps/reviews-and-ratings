/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Query } from 'react-apollo'
import { Button, EmptyState } from 'vtex.styleguide'
import { PersistedPaginatedTable } from 'vtex.paginated-table'
import { useRuntime } from 'vtex.render-runtime'

import { Review } from '../types'
import reviews from '../../../graphql/reviews.graphql'
import { tableQueryMessages } from '../utils/messages'

const NETWORK_REFETCHING_STATUS = 4
const DEFAULT_TABLE_PAGE_TO = 15
const DEFAULT_TABLE_PAGE_FROM = 0
const DEFAULT_SORT_ORDER = 'DESC'

const orderByMap: any = {
  date: 'ReviewDateTime',
}

interface DownloadTableProps {
  toRowData: (review: Review) => any
  reviewStatus: string
  reviewDateTime: string
  schema: any
  emptyStateText?: string | JSX.Element
  filterOptionsLists?: {}
  children?: ({ table }: { table: JSX.Element }) => JSX.Element
}

export const DownloadTable: FC<DownloadTableProps> = ({
  toRowData,
  schema,
  children,
}) => {
  const { query } = useRuntime()

  const [, forceUpdate] = useState<any>()
  //   const [
  //     filterSchema,
  //     brandFilter,
  //     sellerFilter,
  //     categoryFilter,
  //   ] = usePersistedFilters({
  //     intl,
  //     ...filterOptionsLists,
  //   })

  const to = query?.to ? parseInt(query.to, 10) : DEFAULT_TABLE_PAGE_TO
  const from = query?.from ? parseInt(query.from, 10) : DEFAULT_TABLE_PAGE_FROM
  const sortOrder = query?.sortOrder ? query.sortOrder : DEFAULT_SORT_ORDER
  const sortBy = query?.sortedBy

  useEffect(() => {
    forceUpdate({})
  }, [to, from, sortOrder, sortBy])

  const refreshPage = () => window.location.reload()

  return (
    <Query<any, any>
      query={reviews}
      variables={{
        from,
        to,
        orderBy: sortBy
          ? `${orderByMap[sortBy]}:${sortOrder}`
          : 'ReviewDateTime:desc',
      }}
      notifyOnNetworkStatusChange
      fetchPolicy="cache-and-network"
    >
      {({ loading, error, data, networkStatus }) => {
        if (data?.reviews?.range) {
          // empty
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
              onRowClick={() => {}}
              total={data?.reviews?.range ? data.reviews.range.total : 0}
              defaultElementsPerPage={DEFAULT_TABLE_PAGE_TO}
              defaultSortOrder={DEFAULT_SORT_ORDER}
              filters={null}
              dynamicRowHeight
            />
          )

        if (children && typeof children === 'function') {
          return children({ table })
        }
        return table
      }}
    </Query>
  )
}

export default DownloadTable

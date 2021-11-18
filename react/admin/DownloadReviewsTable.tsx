/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import {
  Box,
  Layout,
  PageBlock,
  Button,
  ButtonWithIcon,
  DatePicker,
  IconDownload,
} from 'vtex.styleguide'

import styles from '../styles.css'
import { Review } from './types'
import {
  reviewSchema,
  reviewWithErrorSchema,
  productSchema,
  dateSchema,
} from './schemas'
// import { currentDate, filterDate } from './utils/dates'
import DownloadTable from './components/DownloadTable'

const schema = (intl: IntlShape) => ({
  properties: {
    ...reviewSchema.properties,
    ...reviewWithErrorSchema,
    ...productSchema.properties,
    ...dateSchema(intl).properties,
  },
})

const initialFilters = {
  fromDate: '',
  toDate: '',
}

export const DownlaodReviewsTable: FC = () => {
  const intl = useIntl()
  const [state, setState] = useState<any>({
    filters: initialFilters,
    loading: false,
  })

  const { filters, loading } = state

  const toReviewTableRowData = (review: Review) => {
    const {
      id,
      reviewDateTime,
      reviewerName,
      title,
      text,
      productId,
      shopperId,
      rating,
      sku,
    } = review

    return {
      date: `${intl.formatDate(reviewDateTime)} ${intl.formatTime(
        reviewDateTime
      )}`,
      product: {
        productId,
        sku,
      },
      review: {
        id,
        shopperId,
        reviewerName,
        rating,
        title,
        text,
      },
    }
  }

  const getRequests = (resetFilters: boolean) => {
    const useFilters = resetFilters ? initialFilters : filters
    // let where = `__createdIn=${state.fromDate}`

    if (JSON.stringify(useFilters) === JSON.stringify(initialFilters)) {
      setState({ ...state, isFiltered: false })
    } else {
      setState({ ...state, isFiltered: true })

      /*
      let startDate = '1970-01-01'
      let endDate = currentDate()

      if (useFilters.fromDate !== '' || useFilters.toDate !== '') {
        startDate =
          useFilters.fromDate !== ''
            ? filterDate(useFilters.fromDate)
            : startDate
        endDate =
          useFilters.toDate !== ''
            ? filterDate(useFilters.toDate)
            : filterDate(useFilters.fromDate)
       // where += `__createdIn between ${startDate} AND ${endDate}` */
    }

    // where = `__createdIn="${[useFilters.status]}"`
  }

  /* const [getConfig, { loading: loadingConfig }] = useLazyQuery(GET_BY_ID, {
    onCompleted: (res: any) => {
      onChange(res.getById)
    },
  })

  const load = (id: string) => {
    getConfig({
      variables: {
        id,
      },
    })
  }; */

  const handleResetFilters = () => {
    setState({
      ...state,
      filters: initialFilters,
      tableIsLoading: true,
      isFiltered: false,
    })
    getRequests(true)
  }

  const handleApplyFilters = () => {
    // const { filters } = state

    if (JSON.stringify(filters) === JSON.stringify(initialFilters)) {
      handleResetFilters()
    } else {
      getRequests(false)
    }
  }

  const filterFromDate = (val: string) => {
    setState((prevState: any) => ({
      ...state,
      filters: {
        ...prevState.filters,
        fromDate: val,
        toDate:
          prevState.filters.toDate === '' || prevState.filters.toDate < val
            ? val
            : prevState.filters.toDate,
      },
    }))
    setTimeout(() => {
      handleApplyFilters()
    }, 20000)
  }

  const filterToDate = (val: string) => {
    setState((prevState: any) => ({
      ...state,
      filters: {
        ...prevState.filters,
        toDate: val,
        fromDate:
          prevState.filters.fromDate === '' || prevState.filters.fromDate > val
            ? val
            : prevState.filters.fromDate,
      },
    }))
    setTimeout(() => {
      handleApplyFilters()
    }, 20000)
  }

  // console.log("test", state, filters)
  return (
    <Layout>
      <PageBlock variation="full">
        <div className={`flex items-center ${styles.filterList}`}>
          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnFromDate}`}
          >
            <DatePicker
              placeholder={intl.formatMessage({
                id: 'admin/reviews.filterFromDate',
              })}
              locale="en-GB"
              size="small"
              onChange={(value: any) => filterFromDate(value)}
              value={filters.fromDate}
            />
          </div>

          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnToDate}`}
          >
            <DatePicker
              placeholder={intl.formatMessage({
                id: 'admin/reviews.filterToDate',
              })}
              locale="en-GB"
              size="small"
              onChange={(value: any) => filterToDate(value)}
              value={filters.toDate}
            />
          </div>

          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnActionApply}`}
          >
            <Button size="small" onClick={() => handleApplyFilters()}>
              {intl.formatMessage({
                id: 'admin/reviews.filterResults',
              })}
            </Button>
          </div>

          <div
            className={`ma2 ${styles.filterColumn} ${styles.filterColumnActionReset}`}
          >
            <ButtonWithIcon
              variation="secondary"
              size="small"
              // onClick={() => handleResetFilters()}
            >
              {intl.formatMessage({
                id: 'admin/reviews.clearFilters',
              })}
            </ButtonWithIcon>
          </div>

          <div
            className={`pa6 ma2 ${styles.filterColumn} ${styles.filterColumnActionReset}`}
          >
            <ButtonWithIcon
              size="small"
              icon={IconDownload}
              isLoading={loading}
              onClick={() => {
                // getAllReviews()
              }}
            >
              {intl.formatMessage({
                id: 'admin/reviews.download.icon',
              })}
            </ButtonWithIcon>
          </div>
        </div>

        <DownloadTable
          toRowData={toReviewTableRowData}
          reviewStatus=""
          reviewDateTime=""
          schema={schema(intl)}
          filterOptionsLists={{}}
        >
          {({ table }: { table: JSX.Element }) => (
            <div>
              <Box>{table}</Box>
            </div>
          )}
        </DownloadTable>
      </PageBlock>
    </Layout>
  )
}

export default DownlaodReviewsTable

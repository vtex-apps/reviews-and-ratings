/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLazyQuery } from 'react-apollo'
import {
  Layout,
  PageBlock,
  Button,
  ButtonWithIcon,
  DatePicker,
  IconDownload,
} from 'vtex.styleguide'
import XLSX from 'xlsx'

import { currentDate, filterDate } from './utils/dates'
import styles from '../styles.css'
import ReviewByDateRange from '../../graphql/reviewByDateRange.graphql'

const initialFilters = {
  fromDate: '',
  toDate: '',
}

export const DownlaodReviewsTable: FC = () => {
  const intl = useIntl()
  const [state, setState] = useState<any>({
    filters: initialFilters,
    isFiltered: false,
  })

  const { filters, isFiltered } = state

  const [getData, { loading, data }] = useLazyQuery(ReviewByDateRange)

  const downloadRange = (reviews: any = []) => {
    const header = [
      'Product ID',
      'Title',
      'Review',
      'Rating',
      'Approved',
      'Reviewer',
      'Time',
      'SKU',
    ]
    const rows: any = []

    for (const review of reviews) {
      const reviewData = {
        'Product ID': review.productId,
        Title: review.title,
        Review: review.text,
        Rating: review.rating,
        Approved: review.approved,
        Reviewer: review.reviewerName,
        Time: review.reviewDateTime,
        SKU: review.sku,
      }
      rows.push(reviewData)
    }

    const ws = XLSX.utils.json_to_sheet(rows, { header })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const exportFileName = `reviews.xls`
    XLSX.writeFile(wb, exportFileName)
  }

  const getAllReviews = async () => {
    setState({ ...state, loading: true })
    downloadRange(data.reviewByDateRange.data)

    setState({ ...state, loading: false })
  }

  // trying to use this fuc pass two dates to the useQuery
  const getRequests = (resetFilters: boolean) => {
    const useFilters = resetFilters ? initialFilters : filters

    if (JSON.stringify(useFilters) === JSON.stringify(initialFilters)) {
      setState({ ...state, filters: initialFilters, isFiltered: false })
    } else {
      setState({ ...state, isFiltered: true })

      let startDate = '01/01/1970'
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

        getData({
          variables: {
            fromDate: startDate,
            toDate: endDate,
          },
        })
      } else {
        setState({ ...state, isFiltered: false })
      }
    }
  }

  const handleResetFilters = () => {
    setState({
      filters: initialFilters,
      isFiltered: false,
    })

    getRequests(true)
  }

  const handleApplyFilters = () => {
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
    }, 100000)
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
    }, 100000)
  }

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
          {isFiltered ? (
            <div
              className={`ma2 ${styles.filterColumn} ${styles.filterColumnActionReset}`}
            >
              <ButtonWithIcon
                variation="secondary"
                size="small"
                onClick={() => handleResetFilters()}
              >
                {intl.formatMessage({
                  id: 'admin/reviews.clearFilters',
                })}
              </ButtonWithIcon>
            </div>
          ) : null}
        </div>
        <div>
          {isFiltered ? (
            <div
              className={`pa1 pt7 ${styles.filterColumn} ${styles.filterColumnActionReset}`}
            >
              <ButtonWithIcon
                size="medium"
                icon={IconDownload}
                isLoading={loading}
                onClick={() => {
                  getAllReviews()
                }}
              >
                {intl.formatMessage({
                  id: 'admin/reviews.download.icon',
                })}
              </ButtonWithIcon>
            </div>
          ) : null}
        </div>
      </PageBlock>
    </Layout>
  )
}

export default DownlaodReviewsTable

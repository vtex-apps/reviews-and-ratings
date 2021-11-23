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

import { currentDate, filterDate } from './utils/dates'
import styles from '../styles.css'
// import XLSX from 'xlsx'
import ReviewByDateRange from '../../graphql/reviewByDateRange.graphql'

const initialFilters = {
  fromDate: '',
  toDate: '',
}

export const DownlaodReviewsTable: FC = () => {
  const intl = useIntl()
  const [state, setState] = useState<any>({
    filters: initialFilters,
    load: false,
    isFiltered: false,
  })

  const { filters, load, isFiltered } = state

  /* // the click
  const fetchRange = async () => {
    const response: any = 
      useLazyQuery(ReviewByDateRange, {
        onCompleted: (res: any) => {
          onChange(res.ReviewByDateRange)
        },
      })
      { mode: 'no-cors' }
    

    return response.json()
  }

  // download part : only two issues
  const downloadRange = (allReviews: any) => {
    const header = ['Product ID', 'Title', 'Review', 'Rating', 'Status', 'Reviewer', 'Review Time', 'SKU']
    const data: any = []

    for (const shopper of allReviews) {
      const reviews = shopper.listItemsWrapper  // listItemsWrapper in schema??
      for (const review of reviews) {
        for (const reviewRow of review.listItems) { // where is listItems ??
          const reviewData = {
            'Product ID': reviewRow.productId,
            Title: reviewRow.title,
            Review: reviewRow.text,
            Rating: reviewRow.rating,
            Status: reviewRow.approved,
            Reviewer: reviewRow.reviewerName,
            'Review Time': reviewRow.reviewDateTime,
            SKU: reviewRow.sku,
          }

          data.push(reviewData)
        }
      }
    }

    const ws = XLSX.utils.json_to_sheet(data, { header })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const exportFileName = `reviews.xls`
    XLSX.writeFile(wb, exportFileName)
  }

  let allReviews: any = []

  // pangknation
  const getAllReviews = async () => {
    let status = true
    let i = 0
    const chunkLength = 100
    setState({ ...state, loading: true })

    while (status) {
      await fetchRange(i, i + chunkLength).then(data => { // with the click
        const reviewArr = data.wishLists

        if (!reviewArr.length) {
          status = false
        }
        allReviews = [...allReviews, ...reviewArr]
      })

      i += 100
    }

    downloadRange(allReviews)
    setState({ ...state, loading: false })
  } */

  const [loadEntries] = useLazyQuery(ReviewByDateRange)

  const getRequests = (resetFilters: boolean) => {
    const useFilters = resetFilters ? initialFilters : filters

    if (JSON.stringify(useFilters) === JSON.stringify(initialFilters)) {
      setState({ ...state, isFiltered: false })
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

        loadEntries({
          variables: {
            startDate,
            endDate,
          },
        })
      } else {
        setState({ ...state, isFiltered: false })
      }
    }
  }

  // nice function calling getRequests(true)
  const handleResetFilters = () => {
    setState({
      ...state,
      filters: initialFilters,
      tableIsLoading: true,
      isFiltered: false,
    })
    getRequests(true)
  }

  // nice function calling getRequests(false)
  // onclick -> handleApplyFilters -> getRequests
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
                // onClick={() => handleResetFilters()}
              >
                {intl.formatMessage({
                  id: 'admin/reviews.clearFilters',
                })}
              </ButtonWithIcon>
            </div>
          ) : null}
          {isFiltered ? (
            <div
              className={`pa6 ma2 ${styles.filterColumn} ${styles.filterColumnActionReset}`}
            >
              <ButtonWithIcon
                size="small"
                icon={IconDownload}
                isLoading={load}
                onClick={() => {
                  // getAllReviews()
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

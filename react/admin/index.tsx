/* eslint-disable import/order */
/* eslint-disable no-console */
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useApolloClient } from 'react-apollo'
import type { RenderContext } from 'vtex.render-runtime'
import { useRuntime } from 'vtex.render-runtime'
import {
  Layout,
  PageHeader,
  Tab,
  Tabs,
  ToastProvider,
  IconArrowBack,
  Button,
  Spinner,
} from 'vtex.styleguide'

import {
  PENDING_REVIEWS_PAGE,
  APPROVED_REVIEWS_PAGE,
  DOWNLOAD_REVIEWS_PAGE,
} from './utils'
import { layoutHeaderMessage, adminReviewMessages } from './utils/messages'

import './components/global.css'
import MigrateData from '../../graphql/migrateData.graphql'
import VerifyMigration from '../../graphql/verifyMigration.graphql'
import SuccessfulMigration from '../../graphql/successfulMigration.graphql'

const IconArrowForward: FC = () => (
  <div className="rotate-180 flex items-center">
    <IconArrowBack />
  </div>
)

const ReviewIndex: FC = props => {
  const { navigate, route } = useRuntime() as RenderContext.RenderContext
  const [activeTab, setActiveTab] = useState(route.id)
  const [needsMigrate, setNeedsMigrate] = useState(false)
  const [isMigrationloading, setIsMigrationloading] = useState(false)
  const client = useApolloClient()

  const setActiveSection = (section: string) => () => {
    setActiveTab(section)
    navigate({ page: section })
  }

  const [pending, approved, download] = [
    PENDING_REVIEWS_PAGE,
    APPROVED_REVIEWS_PAGE,
    DOWNLOAD_REVIEWS_PAGE,
  ]

  const flagSuccessfulMigration = () => {
    client
      .query({
        query: SuccessfulMigration,
      })
      .then((response: any) => {
        console.log('SuccessfulMigration:', response)
        if (response.networkStatus === 7) {
          setNeedsMigrate(false)
          setIsMigrationloading(false)
          window.location.reload()
        } else {
          setIsMigrationloading(false)
        }
      })
      .catch(error => {
        setIsMigrationloading(false)
        console.error('flagSuccessfulMigration', error)
      })
  }

  const migrateData = () => {
    client
      .query({
        query: MigrateData,
      })
      .then((response: any) => {
        setIsMigrationloading(true)
        console.log('MigrateData:', response)
        if (response.networkStatus === 7) {
          flagSuccessfulMigration()
        } else {
          setIsMigrationloading(false)
        }
      })
      .catch(error => {
        setIsMigrationloading(false)
        console.error('migrateData', error)
      })
  }

  useEffect(() => {
    client
      ?.query({
        query: VerifyMigration,
      })
      .then((response: any) => {
        console.log('VerifyMigration:', response)
        setNeedsMigrate(response.data.verifyMigration !== '1')
      })
      .catch(error => {
        console.error('VerifyMigration', error)
      })
  }, [client])

  useEffect(() => {
    console.log('needsMigrate:', needsMigrate)
  }, [needsMigrate])

  return (
    <Layout
      pageHeader={
        <div className="flex justify-center">
          <div className="w-100 mw-reviews-header">
            <PageHeader
              title={<FormattedMessage {...layoutHeaderMessage.label} />}
            >
              <a
                className="pointer t-action--small no-underline c-on-base"
                // eslint-disable-next-line no-undef
                href={`../apps/${process.env.VTEX_APP_ID}/setup`}
              >
                <div className="flex items-center">
                  <div className="pr2 b">
                    <FormattedMessage id="admin/reviews.settings.title" />
                  </div>
                  <IconArrowForward />
                </div>
              </a>
            </PageHeader>
            {needsMigrate && (
              <div className="pa7-ns pt0-m">
                <Button onClick={migrateData}>
                  {isMigrationloading ? <Spinner /> : 'Migrate Data'}
                </Button>
              </div>
            )}
          </div>
        </div>
      }
      fullWidth
    >
      <ToastProvider>
        <div className="flex justify-center">
          <div className="w-100 mw-reviews-content pb8">
            <div className="mb7">
              <Tabs>
                <Tab
                  label={
                    <div className="flex">
                      <FormattedMessage {...adminReviewMessages.pendingTab} />
                      {/* <div className="b ml3">
                        {pendingAmount ? formatToTabNumber(pendingAmount) : '-'}
                      </div> */}
                    </div>
                  }
                  active={activeTab === pending}
                  onClick={setActiveSection(pending)}
                />
                <Tab
                  label={
                    <div className="flex">
                      <FormattedMessage {...adminReviewMessages.approvedTab} />
                      {/* <div className="b ml3">
                        {acceptedAmount
                          ? formatToTabNumber(acceptedAmount)
                          : '-'}
                      </div> */}
                    </div>
                  }
                  active={activeTab === approved}
                  onClick={setActiveSection(approved)}
                />
                <Tab
                  label={
                    <div className="flex">
                      <FormattedMessage {...adminReviewMessages.downloadTab} />
                      {/* <div className="b ml3">
                        {downloadAmount ? formatToTabNumber(downloadAmount) : '-'}
                      </div> */}
                    </div>
                  }
                  active={activeTab === download}
                  onClick={setActiveSection(download)}
                />
              </Tabs>
            </div>
            {props.children}
          </div>
        </div>
      </ToastProvider>
    </Layout>
  )
}

export default ReviewIndex

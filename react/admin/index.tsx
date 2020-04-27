import React, { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Layout,
  PageHeader,
  Tab,
  Tabs,
  ToastProvider,
  IconArrowBack,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'

import { PENDING_REVIEWS_PAGE, APPROVED_REVIEWS_PAGE } from './utils'
import { adminReviewMessages, layoutHeaderMessage } from './utils/messages'

import './components/global.css'

const IconArrowForward: FC = () => (
  <div className="rotate-180 flex items-center">
    <IconArrowBack />
  </div>
)

// const formatToTabNumber = (num: number) => {
//   if (num > 10000) {
//     return `${Math.floor(num / 1000)}K`
//   }
//   return num
// }

const ReviewIndex: FC = props => {
  const { navigate, route } = useRuntime()
  const [activeTab, setActiveTab] = useState(route.id)

  const setActiveSection = (section: string) => () => {
    setActiveTab(section)
    navigate({ page: section })
  }

  const [pending, approved] = [PENDING_REVIEWS_PAGE, APPROVED_REVIEWS_PAGE]

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

/* eslint-disable no-console */
import React, { FC, useState, useEffect } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { Modal, Textarea, Button, Divider } from 'vtex.styleguide'
import ReviewCellRenderer from './util/reviewCellRenderer'
import ProductCellRenderer from './util/productCellRenderer'
import { getUserInfo } from '../utils'

const messages = defineMessages({
  label: {
    id: 'admin/reviews.reply.label',
    defaultMessage: 'Reply',
  },
  button: {
    id: 'admin/reviews.reply.button',
    defaultMessage: 'Send',
  },
  info: {
    id: 'admin/reviews.reply.info',
    defaultMessage: 'This reply will be visible publicly',
  },
})
const sessionPromise = getUserInfo()
const useSessionResponse = () => {
  const [session, setSession] = useState()
  useEffect(() => {
    if (!sessionPromise) {
      return
    }
    sessionPromise.then(sessionResponse => {
      const response: any = sessionResponse
      setSession(response)
    })
  }, [])

  return session
}

const ReplyModal: FC<WrappedComponentProps> = ({
  activeReview,
  onReply,
  intl,
}) => {
  const [state, setState] = useState({
    reply: {
      message: '',
      adminUserId: '',
    },
  })

  const sessionResponse: any = useSessionResponse()

  if (!state.reply?.adminUserId && sessionResponse) {
    setState({
      reply: {
        ...state.reply,
        adminUserId: sessionResponse.id,
      },
    })
  }

  const changeHandler = (message: string) => {
    setState({
      reply: {
        ...state.reply,
        message,
      },
    })
  }
  const replyHandler = () => {
    const { reply } = state
    onReply({
      ...activeReview,
      reply,
    })
    setState({
      reply: {
        ...state.reply,
        message: '',
      },
    })
  }

  const closeHandler = () => {
    onReply()
    setState({
      reply: {
        ...state.reply,
        message: '',
      },
    })
  }

  console.log('Modal State =>', state)

  return (
    <Modal
      centered
      isOpen={!!activeReview}
      onClose={closeHandler}
      title={activeReview?.date}
      bottomBar={
        <div className="nowrap">
          <Button
            disabled={!sessionResponse}
            onClick={() => {
              replyHandler()
            }}
          >
            {intl.formatMessage(messages.button)}
          </Button>
        </div>
      }
    >
      <div className="dark-gray">
        <div className="flex">
          <div className="w-40">
            <ReviewCellRenderer cellData={activeReview?.review} />
          </div>
          <div
            style={{ flexGrow: 1 }}
            className="flex items-stretch w-20 justify-center"
          >
            <Divider orientation="vertical" />
          </div>
          <div className="w-40">
            <ProductCellRenderer cellData={activeReview?.product} />
          </div>
        </div>

        <div className="mb6">
          <Textarea
            size="large"
            rows={10}
            value={state.reply.message}
            helpText={intl.formatMessage(messages.info)}
            onChange={(e: any) => changeHandler(e.target.value)}
            label={intl.formatMessage(messages.label)}
          />
        </div>
      </div>
    </Modal>
  )
}
export default injectIntl(ReplyModal)

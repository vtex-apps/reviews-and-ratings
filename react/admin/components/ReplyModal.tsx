/* eslint-disable no-console */
import React, { FC, useState } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { Modal, Textarea, Button, Divider } from 'vtex.styleguide'
import ReviewCellRenderer from './util/reviewCellRenderer'
import ProductCellRenderer from './util/productCellRenderer'

const messages = defineMessages({
  label: {
    id: 'admin/reviews.reply.label',
    defaultMessage: 'Reply',
  },
  button: {
    id: 'admin/reviews.reply.button',
    defaultMessage: 'Send',
  },
})

const ReplyModal: FC<WrappedComponentProps> = ({
  activeReview,
  onReply,
  intl,
}) => {
  const [state, setState] = useState({
    reply: '',
  })

  const changeHandler = (reply: any) => {
    setState({
      reply,
    })
  }
  const replyHandler = () => {
    const { reply } = state
    onReply({
      ...activeReview,
      reply,
    })
    setState({
      reply: '',
    })
  }

  const closeHandler = () => {
    onReply()
    setState({
      reply: '',
    })
  }

  return (
    <Modal
      centered
      isOpen={!!activeReview}
      onClose={closeHandler}
      title={activeReview?.date}
      bottomBar={
        <div className="nowrap">
          <Button
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
            value={state.reply}
            onChange={(e: any) => changeHandler(e.target.value)}
            label={intl.formatMessage(messages.label)}
          />
        </div>
      </div>
    </Modal>
  )
}
export default injectIntl(ReplyModal)

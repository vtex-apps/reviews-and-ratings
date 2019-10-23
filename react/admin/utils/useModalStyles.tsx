import { useModalStyles } from 'vtex.channels-components'

const MODAL_CUSTOM_STYLES = `
  @import '//io.vtex.com.br/fonts/fabriga/stylesheet.css';
  @media screen and (min-width: 40em) {
    .mutation-modal-width-ns {
      width: 704px;
    }
    .vtex-modal__modal {
      max-width: 100%;
      width: 960px;
    }
  }
  .mh-100 {
    max-height: 100%;
  }
`

export const useModalCustomStyles = () => {
  return useModalStyles(MODAL_CUSTOM_STYLES)
}

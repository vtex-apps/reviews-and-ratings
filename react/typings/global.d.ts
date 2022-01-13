import { FunctionComponent } from 'react'

interface Runtime {
  rootPath?: string
  account: string
  workspace: string
}
declare global {
  namespace NodeJS {
    interface Global extends Global {
      __hostname__: string
      __pathname__: string
      __RUNTIME__: Runtime
    }
  }

  interface Window extends Window {
    __RENDER_8_SESSION__: RenderSession
    __RUNTIME__: Runtime
  }

  interface RenderSession {
    patchSession: (data: any) => Promise<void>
    sessionPromise: Promise<void>
  }

  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  interface StorefrontComponent<P = {}, S = {}> extends Component<P, S> {
    schema?: object
    getSchema?(props: P): object
  }

  interface StorefrontElement extends ReactElement {
    schema?: object
    getSchema?(props: P): object
  }

  interface Session {
    loading: boolean
    refetch: () => void
    getSession: {
      adminUserEmail: string
      adminUserId: string
      impersonable: boolean
      profile: Profile
      impersonate: {
        storeUserId: string
        storeUserEmail: string
        profile: Profile
      }
    }
  }

  interface ProcessedSession {
    attendantEmail: string
    canImpersonate: boolean
    client?: Client
  }

  interface Profile {
    document: string
    phone: string
    firstName: string
    lastName: string
    email: string
  }

  interface Client {
    document: string
    phone: string
    name: string
    email: string
  }
}

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import GoodsProvides from '../pages/goods/components/goodsProvides'
import { Provider } from 'react-redux'
import { wrapper } from '../app/store'

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)
  return (
    <Provider store={store}>
      <Layout>
        <GoodsProvides>
          <Component {...props.pageProps} />
        </GoodsProvides>
      </Layout>
    </Provider>
  )
}

export default MyApp

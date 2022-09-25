import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import GoodsProvides from '../pages/goods/components/goodsProvides'
import { Provider } from 'react-redux'
import store from '../app/store'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <GoodsProvides>
          <Component {...pageProps} />
        </GoodsProvides>
      </Layout>
    </Provider>
  )
}

export default MyApp

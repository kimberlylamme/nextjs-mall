import { useEffect, useState } from 'react'
import { ViewGrid, ViewList } from '../../components/svg'
import { Product } from '../../interfaces/goods'
import Card from '../../components/card'
import Search from '../../components/search'
import { useRef } from 'react'
import Toolbal from './components/toolbar'
import { useRouter } from 'next/router'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  fetchProducts,
  fetchFilterProducts,
  storeFilterProducts,
  isLoad,
} from '../../features/productSlice'
import { wrapper } from '../../app/store'

const List = ({ products }: { products: Product[] }) => {
  const router = useRouter()
  const q = router.query.q ? (router.query.q as string) : ''
  const containRef = useRef<HTMLDivElement>(null)
  const [isVertical, setIsVertical] = useState(false)
  const [params, setParams] = useState({
    page: 1,
    sales: '',
    price: '',
    keyWord: q,
  })

  const dispatch = useAppDispatch()
  const filterProducts = useAppSelector(storeFilterProducts)
  const isload = useAppSelector((state) => state.products.loading)

  useEffect(() => {
    if (!products || products.length === 0) return
    console.log('product', params.page)
    dispatch(fetchFilterProducts({ products: products, params: params }))
  }, [dispatch, params, products])

  const onScroll = () => {
    if (isload === false) return
    if (!containRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containRef.current
    if (scrollTop + clientHeight !== scrollHeight) return
    setParams({ ...params, page: params.page + 1 })
  }

  return (
    <div className="h-screen overflow-y-auto" onScroll={onScroll} ref={containRef}>
      {/* 搜索 */}
      <div className=" bg-blue-400 py-4 px-2">
        <Search
          keyWord={params.keyWord}
          onSearch={(q: string) => {
            setParams({ ...params, page: 1, keyWord: q })
            dispatch(isLoad())
          }}
        />
      </div>
      {/* 筛选 */}
      <div className="mb-4 rounded-t-lg bg-white">
        <Toolbal
          onSale={(sales) => {
            setParams({ ...params, page: 1, sales: sales ? 'down' : '', price: '' })
            dispatch(isLoad())
          }}
          onPrice={(price) => {
            setParams({ ...params, page: 1, price: price, sales: '' })
            dispatch(isLoad())
          }}
        />
      </div>
      {/* 列表 */}
      <div className={`grid gap-4 ${isVertical ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {filterProducts?.map((card) => (
          <Card key={card.goodsId} isVertical={isVertical} product={card}></Card>
        ))}
        <div className=" fixed bottom-10 right-5 space-y-4">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 bg-white p-1 text-gray-400"
            onClick={() => setIsVertical(!isVertical)}
          >
            {isVertical ? <ViewList /> : <ViewGrid />}
          </div>
        </div>
      </div>
    </div>
  )
}
export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  await store.dispatch(fetchProducts())
  return {
    props: {
      products: store.getState().products.products,
    },
  }
})
export default List

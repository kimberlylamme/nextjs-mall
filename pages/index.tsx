import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { fetchProducts, fetchFilterProducts, storeFilterProducts } from '../features/productSlice'
import { fetchAd } from '../features/bannerSlice'
import { wrapper } from '../app/store'
import { Product } from '../interfaces/goods'
import { Banner } from '../interfaces/banner'
import Search from '../components/search'
import Card from '../components/card'
import Carousel from './home/carousel'
import Nav from './home/nav'

const Index = ({ adLists, products }: { adLists: Banner[]; products: Product[] }) => {
  const router = useRouter()
  const onSearch = (keyWord: string) => {
    if (!keyWord) {
      router.push('/goods/list')
    } else {
      router.push({ pathname: '/goods/list', query: { q: keyWord } })
    }
  }

  const dispatch = useAppDispatch()
  const filterProducts = useAppSelector(storeFilterProducts)
  const isload = useAppSelector((state) => state.products.loading)
  const [page, setPage] = useState(1)
  const goodsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('index', page)
    if (!products || products?.length === 0) return
    dispatch(fetchFilterProducts({ products: products, params: { page: page } }))
  }, [dispatch, page, products])

  const onScroll = () => {
    if (isload === false) return
    if (!goodsRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = goodsRef.current
    if (scrollTop + clientHeight !== scrollHeight) return
    setPage((page) => page + 1)
  }

  return (
    <div className="mb-16 h-screen overflow-y-auto" onScroll={onScroll} ref={goodsRef}>
      {/* 搜索 */}
      <div className="bg-blue-400 py-4 px-2">
        <Search keyWord="" onSearch={(q: string) => onSearch(q)} />
      </div>

      {/* 轮播 */}
      <Carousel ads={adLists} />

      {/* 快捷入口 */}
      <Nav />

      {/* 秒杀 */}
      <div className="my-2  px-2">
        <div className=" relative h-32 w-full rounded-lg">
          <Image src="/active.jpg" layout="fill" alt="促销活动" />
        </div>
        <Swiper slidesPerView={2.5} spaceBetween={16} className="mySwiper bg-gray-100">
          {products?.slice(0, 6).map((good: Product) => (
            <SwiperSlide key={good.goodsId}>
              <Card isVertical={true} product={good}></Card>
            </SwiperSlide>
          ))}
          <SwiperSlide className="!h-auto">
            <Link href={'/goods/list'}>
              <a className="flex h-full items-center justify-center bg-white py-4 px-3">查看更多</a>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* 猜你喜欢 */}
      <div>
        <div className="my-2 flex items-center justify-center p-2">
          <hr className="h-1 w-20 text-black" />
          <h1 className="mx-2 text-xl text-gray-500">猜你喜欢</h1>
          <hr className="w-20 text-black" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filterProducts?.map((good: Product) => (
            <Card key={good.goodsId} isVertical={true} product={good}></Card>
          ))}
        </div>
      </div>
    </div>
  )
}
export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  await store.dispatch(fetchAd())
  await store.dispatch(fetchProducts())

  return {
    props: {
      adLists: store.getState().banner.adLists,
      products: store.getState().products.products,
    },
  }
})
export default Index

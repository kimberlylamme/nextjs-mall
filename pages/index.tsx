import Search from '../components/search'
import Card from '../components/card'
import Carousel from './home/carousel'
import Nav from './home/nav'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { fetchProducts, storeProducts } from '../features/productSlice'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { Product } from '../interfaces/goods'
import Image from 'next/image'
import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import Link from 'next/link'

const Index = () => {
  const router = useRouter()
  const onSearch = (keyWord: string) => {
    if (!keyWord) {
      router.push('/goods/list')
    } else {
      router.push({ pathname: '/goods/list', query: { q: keyWord } })
    }
  }

  const [page, setPage] = useState(1)
  const goodsRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const isload = useAppSelector((state) => state.products.loading)
  const goods = useAppSelector(storeProducts)

  useEffect(() => {
    console.log('index', page)
    dispatch(fetchProducts({ page: page }))
  }, [dispatch, page])

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
      <Carousel />

      {/* 快捷入口 */}
      <Nav />

      {/* 秒杀 */}
      <div className="my-2  px-2">
        <div className=" relative h-32 w-full rounded-lg">
          <Image src="/active.jpg" layout="fill" alt="促销活动" />
        </div>
        <Swiper slidesPerView={2.5} spaceBetween={16} className="mySwiper bg-gray-100">
          {goods?.slice(0, 6).map((good: Product) => (
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
          {goods?.map((good: Product) => (
            <Card key={good.goodsId} isVertical={true} product={good}></Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Index

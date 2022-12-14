import ActionBar from './components/actionBar'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import Sku from './components/sku'
import useGoods from '../../components/useGoods'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchProductInfo, fetchProducts, storeProductInfo } from '../../features/productSlice'
import { Product } from '../../interfaces/goods'
import Image from 'next/image'
import { wrapper } from '../../app/store'

const Detail = ({ products }: { products: Product[] }) => {
  const router = useRouter()
  const id = router.query.id ? Number(router.query.id) : 0
  const dispatch = useAppDispatch()
  const {
    isShowSku,
    openSku,
    closeSku,
    toSku,
    selectSku,
    setSkuTrees,
    setSkus,
    setMatchSku,
    setSelectSku,
  } = useGoods()
  const handleToggleSku = (isShowSku: boolean) => (isShowSku ? closeSku() : openSku())
  const product: Product = useAppSelector(storeProductInfo)

  useEffect(() => {
    if (!products || products.length === 0) return
    dispatch(fetchProductInfo({ products: products, goodsId: id }))
  }, [dispatch, id, products])

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setSkuTrees([])
      setSkus([])
      setMatchSku([])
      setSelectSku({
        price: 0,
        stock: 0,
        skuName: '',
        skuId: 0,
        image: '',
        count: 1,
      })
      if (product.skus.length === 0) {
        setSelectSku({
          image: product.image,
          price: product.price,
          stock: product.stock,
          count: 1,
          skuName: '',
          skuId: 0,
        })
        return
      }
      setSkuTrees(product.skuTrees)
      setSkus(product.skus)
    }
  }, [product])

  return (
    <div>
      {product?.image && (
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          initialSlide={1}
          loop={true}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <div className=" relative h-80 w-full">
              <Image src={product.image} alt="" layout="fill" />
            </div>
          </SwiperSlide>

          {product?.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className=" relative h-80 w-full">
                <Image src={image} alt="" layout="fill" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="m-2 rounded-xl bg-white p-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-red-600">
            <span>???</span>
            <span className="text-2xl">{selectSku?.price}</span>
          </div>
        </div>
        <div className="mt-3 text-base font-bold line-clamp-2">{product?.goodsName}</div>
      </div>

      <div className="m-2 mt-2 flex flex-col gap-7 rounded-xl bg-white p-3 text-sm">
        {product?.skus?.length > 0 && (
          <div
            className="flex items-center justify-between"
            onClick={() => {
              toSku(), handleToggleSku(isShowSku)
            }}
          >
            <div className="text-gray-500">??????</div>
            <div>{selectSku.skuName ? selectSku.skuName : '???????????????'}</div>
            <div className="text-gray-500">&gt;</div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-gray-500">??????</div>
          <div>???????????? ??????...</div>
          <div className="text-gray-500">&gt;</div>
        </div>
      </div>

      <Sku products={products} goodsId={product?.goodsId} />

      <div className="mt-2 mb-16 rounded-t-xl bg-white">
        {/* <div dangerouslySetInnerHTML={{ __html: good?.goods_content }}></div> */}
      </div>

      <ActionBar />
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
export default Detail

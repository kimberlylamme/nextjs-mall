import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import {
  cartList,
  fetchCartList,
  fetchDelCart,
  fetchSelectCart,
  fetchUpdateCart,
} from '../../features/cartSlice'
import { fetchProducts } from '../../features/productSlice'
import { wrapper } from '../../app/store'
import { Product } from '../../interfaces/goods'

const Index = ({ products }: { products: Product[] }) => {
  const dispatch = useAppDispatch()
  const cartProducts = useAppSelector(cartList)
  const [selectedAll, setselectedAll] = useState<boolean>(false)
  const [isSelect, setIsSelect] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<string>('0.00')

  useEffect(() => {
    if (!products || products.length === 0) return
    dispatch(fetchCartList(products))
  }, [dispatch, products])

  useEffect(() => {
    if (!cartProducts || cartProducts.length === 0) return
    let total: number = 0.0
    let checkAll = true
    let checkCal = false
    let copyProducts = JSON.parse(JSON.stringify(cartProducts))
    copyProducts.map((item: any) => {
      if (item.selected === 0 && checkAll === true) checkAll = false
      if (item.selected === 1 && checkCal === false) checkCal = true
      if (item.selected === 1) {
        total += item.price * item.count
      }
    })
    setTotalPrice(total.toFixed(2))
    setselectedAll(checkAll)
    setIsSelect(checkCal)
  }, [cartProducts])

  const handleRadio = (goodsId: number, skuId: number) => {
    let copyCartProducts = JSON.parse(JSON.stringify(cartProducts))
    copyCartProducts.map((item: any) => {
      if (item.goodsId === goodsId && item.skuId === skuId)
        item.selected = item.selected === 0 ? 1 : 0
    })
    dispatch(fetchSelectCart(copyCartProducts)).then((res: any) => {
      if (res.payload.code === 1) dispatch(fetchCartList(products))
    })
  }

  const handleSelectAll = () => {
    let copyCartProducts = JSON.parse(JSON.stringify(cartProducts))
    copyCartProducts.map((item: any) => {
      item.selected = selectedAll ? 0 : 1
    })
    dispatch(fetchSelectCart(copyCartProducts)).then((res: any) => {
      if (res.payload.code === 1) dispatch(fetchCartList(products))
    })
  }

  interface paramsUpdateCart {
    goodsId: number
    skuId: number
    num: number
    type: string
  }
  const handleUpdateCart = ({ goodsId, skuId, num, type = 'replace' }: paramsUpdateCart) => {
    const copyProducts = JSON.parse(JSON.stringify(cartProducts))
    const product: any = copyProducts.find(
      (item: any) => item.goodsId === goodsId && item.skuId === skuId,
    )

    if (!product) return
    let count = product.count
    switch (type) {
      case 'reduce':
        if (product.count === 1) return
        count = parseInt(product.count) - 1
        break
      case 'add':
        count = parseInt(product.count) + 1
        break
      default:
        count = Number(num)
    }
    product.count = count
    dispatch(fetchUpdateCart(copyProducts)).then((res: any) => {
      if (res.payload.code === 1) dispatch(fetchCartList(products))
    })
  }

  const handleDelCart = (goodsId: number, skuId: number) => {
    dispatch(fetchDelCart({ goodsId, skuId })).then((res: any) => {
      if (res.payload.code === 1) dispatch(fetchCartList(products))
    })
  }

  if (cartProducts.length == 0) return <div className=" py-5 text-center">购物车空空如也</div>
  return (
    <div className=" overflow-y-auto">
      <div className="mx-2 mt-2">
        {cartProducts &&
          cartProducts.map((item: any, key: number) => (
            <div key={key} className="mb-3 flex gap-3 rounded-lg bg-white p-2 text-sm">
              <div className="flex w-full items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.selected === 1}
                  className="h-5 w-5"
                  onChange={() => handleRadio(item.goodsId, item.skuId)}
                />
                <Image src={item.image} alt="" width={100} height={100} />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="line-clamp-2">{item.goodsName}</div>
                  <div className="flex gap-4 text-base">
                    <span
                      onClick={() =>
                        item.count > 1
                          ? handleUpdateCart({
                              goodsId: item.goodsId,
                              skuId: item.skuId,
                              num: 1,
                              type: 'reduce',
                            })
                          : ''
                      }
                    >
                      -
                    </span>
                    <span>{item.count}</span>
                    <span
                      onClick={() =>
                        handleUpdateCart({
                          goodsId: item.goodsId,
                          skuId: item.skuId,
                          num: 1,
                          type: 'add',
                        })
                      }
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-around">
                <div className="text-red-700">￥{item.price}</div>
                <div onClick={() => handleDelCart(item.goodsId, item.skuId)}>删除</div>
              </div>
            </div>
          ))}
      </div>
      <div className="fixed bottom-0 z-20 flex w-full justify-between bg-white text-gray-600">
        <div className="flex w-full flex-1 items-center justify-between gap-6 px-4 text-lg">
          <div className="flex  items-center gap-2">
            <input
              type={'checkbox'}
              className="h-6 w-6"
              checked={selectedAll}
              onChange={() => handleSelectAll()}
            />
            全选
          </div>
          <div className="flex flex-1 items-center justify-between">
            <div className=" text-sm">总计：</div>
            <div className="text-red-600">{totalPrice}</div>
          </div>
        </div>
        <div
          className={`mr-1 mb-1  px-10 py-5 text-xl text-white ${
            isSelect ? 'bg-red-600' : 'bg-gray-500'
          }`}
        >
          去结算
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
export default Index

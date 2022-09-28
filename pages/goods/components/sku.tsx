import { useEffect } from 'react'
import useGoods from '../../../components/useGoods'
import { useAppDispatch } from '../../../app/hooks'
import { fetchAddCart } from '../../../features/cartSlice'
import Image from 'next/image'
import { SkuTree, Sku, Product } from '../../../interfaces/goods'

const Sku = ({ products, goodsId = 0 }: { products: Product[]; goodsId: number }) => {
  const dispatch = useAppDispatch()
  const {
    isShowSku,
    openSku,
    closeSku,
    matchSku,
    setMatchSku,
    status,
    skuTrees,
    setSkuTrees,
    skus,
    selectSku,
    setSelectSku,
  } = useGoods()
  const handleToggleSku = (isShowSku: boolean) => (isShowSku ? closeSku() : openSku())

  useEffect(() => {
    const matchSkuKey = Object.keys(JSON.parse(JSON.stringify(matchSku)))
    if (matchSkuKey.length == 0 && skus.length > 0) {
      const skuInfo = skus.find((item) => item.stock > 0)
      if (!skuInfo) return
      setMatchSku(skuInfo.key)
      setSelectSku({
        price: skuInfo.price,
        stock: skuInfo.stock,
        skuName: skuInfo.name,
        skuId: skuInfo.skuId,
        image: skuInfo.image,
        count: 1,
      })
    }
  }, [skus])

  useEffect(() => {
    if (skuTrees.length == 0) return
    const copySkuTrees = JSON.parse(JSON.stringify(skuTrees))
    copySkuTrees.map((skuTree: SkuTree) => {
      skuTree.childs.map((child: any) => {
        child.able = IsAble(skuTree.id, child.itemId)
      })
    })
    setSkuTrees(copySkuTrees)
    checkStock()
  }, [matchSku])

  const IsAble = (treeId: number, value: number) => {
    const copyMatchSku = JSON.parse(JSON.stringify(matchSku))
    copyMatchSku[treeId] = value
    const matchSkuValues = Object.values(copyMatchSku)
    const flag = skus.some((sku: Sku) => {
      if (sku.stock <= 0) return false
      const skuChildValues = Object.values(sku.key)
      const someSpecs = skuChildValues.filter((spec) => matchSkuValues.includes(spec) === true)
      return someSpecs.length === matchSkuValues.length ? true : false
    })
    return flag
  }

  const checkStock = () => {
    const countTree = skuTrees.length
    const skuValue = Object.values(JSON.parse(JSON.stringify(matchSku)))
    const countSku = skuValue.length
    if (countTree != countSku) {
      setSelectSku({
        ...selectSku,
        skuName: '',
        skuId: 0,
      })
      return false
    }
    skus.some((sku: Sku) => {
      const skuChildValues = Object.values(JSON.parse(JSON.stringify(sku.key)))
      const res = skuChildValues.every((skuChild: any) => skuValue.includes(skuChild))
      if (res) {
        let newSelectSku: any = {
          price: sku.price,
          stock: sku.stock,
          skuName: sku.name,
          skuId: sku.skuId,
          image: sku.image,
        }
        if (selectSku.count > sku.stock) newSelectSku = { ...newSelectSku, count: sku.stock }
        setSelectSku({
          ...selectSku,
          ...newSelectSku,
        })
        return true
      }
    })
    return true
  }

  const chooseSku = (id: number, itemId: number, able: boolean) => {
    if (!able) return
    let copyMatchSku = JSON.parse(JSON.stringify(matchSku))
    const skuKey = Object.keys(copyMatchSku)
    if (skuKey.length === 0) {
      copyMatchSku[id] = itemId
      setMatchSku(copyMatchSku)
      return
    }
    if (skuKey.includes(id.toString()) === false) {
      copyMatchSku[id] = itemId
      setMatchSku(copyMatchSku)
      return
    }
    copyMatchSku[id] === itemId ? delete copyMatchSku[id] : (copyMatchSku[id] = itemId)
    setMatchSku(copyMatchSku)
  }

  const handleCount = (e: { target: { value: any } }) => {
    const value = e.target.value
    if (value > 0) {
      setSelectSku({
        ...selectSku,
        count: value,
      })
    }
  }

  const handleAddCart = () => {
    const countTree = skuTrees.length
    const skuValue = Object.values(JSON.parse(JSON.stringify(matchSku)))
    const countSku = skuValue.length
    if (countTree != countSku) {
      console.log('请选择商品规格')
      return
    }
    if (selectSku.count <= 0) {
      console.log('请选择商品数量')
      return
    }
    if (selectSku.count > selectSku.stock) {
      console.log('超出库存')
      return
    }

    const res = checkStock()
    if (!res) {
      console.log('请选择商品规格')
      return
    }
    console.log('购物车', selectSku)
    dispatch(
      fetchAddCart({
        products: products,
        params: {
          goodsId: goodsId,
          skuId: selectSku.skuId,
          count: selectSku.count,
        },
      }),
    ).then((res: any) => {
      console.log(res.payload)
    })
  }

  const handleBuy = () => {
    console.log('立即购买')
    const res = checkStock()
    if (!res) {
      console.log('请选择商品规格')
      return
    }
    console.log(selectSku)
  }

  return (
    <div className={`${isShowSku ? '' : 'hidden'} fixed top-0 left-0 z-20 h-full w-full`}>
      <div className="h-full w-full bg-black/50" onClick={() => handleToggleSku(isShowSku)}></div>
      <div className="absolute bottom-0 z-30 h-2/3 w-full  overflow-y-auto rounded-t-xl bg-white ">
        <div className="w-full px-4">
          <div className="my-5 flex items-end gap-3">
            <div className=" relative h-20 w-20">
              {selectSku.image && <Image src={selectSku.image} alt="" layout="fill" />}
            </div>
            <div>
              <div className="text-red-600">
                ￥<span className="text-2xl">{selectSku.price}</span>
              </div>
              <div>{selectSku.skuName ? `已选：${selectSku.skuName}` : ''}</div>
            </div>
          </div>

          <div className="w-full space-y-4">
            {skuTrees?.map((skuTree: SkuTree, key: number) => {
              return (
                <div key={key}>
                  <div className="font-bold">{skuTree.name}</div>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {skuTree?.childs.map((child: any, kk: number) => {
                      return (
                        <span
                          key={kk}
                          className={`rounded-2xl bg-gray-300 px-2 py-1 ${
                            child.itemId === matchSku[skuTree.id]
                              ? 'border border-blue-500 text-blue-500'
                              : ''
                          } ${child.able ? '' : 'opacity-50'}`}
                          onClick={() => {
                            chooseSku(skuTree.id, child.itemId, child.able)
                          }}
                        >
                          {child.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="my-10 flex justify-between">
            <div className="font-bold">数量</div>
            <div className="flex items-center gap-3 text-base font-bold">
              <div
                className={`${selectSku.count <= 1 ? 'text-gray-500' : ''}`}
                onClick={() => {
                  selectSku.count > 1
                    ? setSelectSku({
                        ...selectSku,
                        count: selectSku.count - 1,
                      })
                    : ''
                }}
              >
                -
              </div>
              <input
                className="w-8 text-center outline-none"
                type="number"
                value={selectSku.count}
                onChange={(e) => handleCount(e)}
              />

              <div
                onClick={() => {
                  selectSku.stock > selectSku.count
                    ? setSelectSku({
                        ...selectSku,
                        count: selectSku.count + 1,
                      })
                    : selectSku.count
                }}
              >
                +
              </div>
            </div>
          </div>
        </div>

        {status == 0 && (
          <div className=" absolute bottom-0 mb-2 grid w-full grid-cols-2 place-items-center gap-5 px-4 text-white">
            <div
              className="flex w-full items-center justify-center rounded-3xl bg-red-600 px-4 py-2"
              onClick={() => {
                handleAddCart()
              }}
            >
              加入购物车
            </div>
            <div
              className="flex w-full items-center justify-center rounded-3xl bg-yellow-400 px-4 py-2"
              onClick={() => {
                handleBuy()
              }}
            >
              立即购买
            </div>
          </div>
        )}
        {status > 0 && (
          <div className=" absolute bottom-0 mb-2 w-full px-4 text-white">
            <div
              className="flex w-full items-center justify-center rounded-3xl bg-red-600 px-4 py-2 "
              onClick={() => {
                status == 1 ? handleAddCart() : handleBuy()
              }}
            >
              确定
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Sku

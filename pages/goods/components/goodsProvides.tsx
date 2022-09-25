import { useState, createContext, useContext } from 'react'
import { SkuTree, SelectSku, Sku, GoodsContext } from '../../../interfaces/goods'

const GoodsContext = createContext(undefined)
export const useGoodsContext = (): GoodsContext => {
  const context = useContext(GoodsContext)
  if (!context) {
    throw new Error('useGoodsContext must be used within a GoodsContextProvider')
  }
  return context
}

const GoodsProvides = (props: any) => {
  const [status, setStatus] = useState<number>(0)
  const [isShowSku, setIsShowSku] = useState(false)
  const [matchSku, setMatchSku] = useState<any>({})
  const [skuTrees, setSkuTrees] = useState<SkuTree[]>([])
  const [skus, setSkus] = useState<Sku[]>([])
  const [selectSku, setSelectSku] = useState<SelectSku>({
    skuId: 0,
    skuName: '',
    image: '',
    price: 0,
    stock: 0,
    count: 1,
  })

  const GoodsValue: GoodsContext = {
    isShowSku,
    setIsShowSku,
    matchSku,
    setMatchSku,
    status,
    setStatus,
    skuTrees,
    setSkuTrees,
    skus,
    setSkus,
    selectSku,
    setSelectSku,
  }

  return <GoodsContext.Provider value={GoodsValue} {...props} />
}
export default GoodsProvides

import { useGoodsContext } from '../pages/goods/components/goodsProvides'

const useGoods = () => {
  const goodsConttol = useGoodsContext()
  const openSku = () => goodsConttol.setIsShowSku(true)
  const closeSku = () => goodsConttol.setIsShowSku(false)
  const toSku = () => goodsConttol.setStatus(0)
  const toCart = () => goodsConttol.setStatus(1)
  const toBuy = () => goodsConttol.setStatus(2)

  return {
    ...goodsConttol,
    openSku,
    closeSku,
    toSku,
    toCart,
    toBuy,
  }
}
export default useGoods

import Link from 'next/link'
import useGoods from '../../../components/useGoods'

const ActionBar = () => {
  const { openSku, toCart, toBuy } = useGoods()
  return (
    <div className="fixed bottom-0 z-10 flex h-16 w-full flex-row justify-between bg-white p-2 text-sm">
      <div className="flex justify-around gap-6">
        <Link href={'/'}>
          <a>
            <div className="flex flex-col items-center gap-1">
              <div className="h-5 w-5 bg-blue-500"></div>
              <div>首页</div>
            </div>
          </a>
        </Link>
        <Link href={'/cart'}>
          <a>
            <div className="flex flex-col items-center gap-1">
              <div className="h-5 w-5 bg-blue-500"></div>
              <div>购物车</div>
            </div>
          </a>
        </Link>
      </div>
      <div className="grid grid-cols-2 place-items-center gap-3 text-white">
        <div
          className=" flex w-full items-center justify-center rounded-3xl bg-red-600 px-3 py-2"
          onClick={() => {
            openSku(), toCart()
          }}
        >
          加入购物车
        </div>
        <div
          className=" flex w-full items-center justify-center rounded-3xl bg-yellow-400 px-3 py-2"
          onClick={() => {
            openSku(), toBuy()
          }}
        >
          立即购买
        </div>
      </div>
    </div>
  )
}
export default ActionBar

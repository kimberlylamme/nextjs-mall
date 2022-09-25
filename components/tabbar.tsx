import Link from 'next/link'
import { useRouter } from 'next/router'
import { Home, ShoppingCart, User } from './svg'
const Tabbar = () => {
  const router = useRouter()
  return (
    <div className=" fixed bottom-0 flex h-16 w-full justify-between border-t bg-white text-gray-700">
      <Link href="/">
        <a
          className={`flex flex-col items-center justify-center gap-1 px-4 py-1 ${
            router.pathname === '/' ? 'text-blue-500' : ''
          }`}
        >
          <Home />
          <div>首页</div>
        </a>
      </Link>

      <Link href="/cart">
        <a
          className={`flex flex-col items-center justify-center gap-1 px-4 py-1 ${
            router.pathname === '/cart' ? 'text-blue-500' : ''
          }`}
        >
          <ShoppingCart />
          <div>购物车</div>
        </a>
      </Link>

      <Link href="/my">
        <a
          className={`flex flex-col items-center justify-center gap-1 px-4 py-1 ${
            router.pathname === '/my' ? 'text-blue-500' : ''
          }`}
        >
          <User />
          <div>我的</div>
        </a>
      </Link>
    </div>
  )
}
export default Tabbar

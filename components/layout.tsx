import Router, { useRouter } from 'next/router'
import Tabbar from './tabbar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const tabbarData = ['/', '/my']
  const isShowTabbar = tabbarData.includes(router.pathname)
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <main>{children}</main>
      {isShowTabbar && <Tabbar />}
    </div>
  )
}

export default Layout

import Link from 'next/link'

const NavLists = [
  { img: '', title: '商品', link: '/goods/list' },
  { img: '', title: '推荐', link: '/goods/list' },
  { img: '', title: '热销', link: '/goods/list' },
  { img: '', title: '秒杀', link: '/goods/list' },
]
const Nav = () => {
  return (
    <div className="mb-2 grid grid-cols-4 place-items-center gap-4 rounded-lg bg-white p-3">
      {NavLists.map((item, index) => {
        return (
          <Link href={item.link} key={index}>
            <a className="flex flex-col items-center space-y-1">
              <div className=" h-10 w-10 rounded-full bg-blue-500"></div>
              <span>{item.title}</span>
            </a>
          </Link>
        )
      })}
    </div>
  )
}
export default Nav

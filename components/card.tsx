import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../interfaces/goods'

const Card = ({ product, isVertical }: { product: Product; isVertical: boolean }) => {
  return (
    <Link href={`/goods/detail?id=${product.goodsId}`}>
      <a>
        <section
          className={`${
            isVertical ? 'flex-col' : 'flex-row'
          } flex h-full items-center gap-3 bg-white px-3 py-4`}
        >
          <Image src={product.image} alt={product.goodsName} width={140} height={140} />
          <div className="w-full flex-1">
            <div className="mb-2 text-sm line-clamp-2">{product.goodsName}</div>
            <div className="flex flex-col gap-1 text-sm font-semibold text-red-700">
              <span>￥{product.price}</span>
              <span className="text-xs font-normal text-gray-500 line-through">
                ￥{product.marketPrice}
              </span>
            </div>
            <div className=" mt-2 text-xs text-gray-700">已售：{product.sales}件</div>
          </div>
        </section>
      </a>
    </Link>
  )
}

export default Card

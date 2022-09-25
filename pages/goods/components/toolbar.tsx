import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter } from '../../../components/svg'

const Toolbal = ({ onSale = (f: any) => f, onPrice = (f: any) => f }) => {
  const [isSale, setIsSale] = useState(false)
  const [isPrice, setIsPrice] = useState('')
  const onSaleClick = () => {
    setIsPrice('')
    setIsSale(!isSale)
    onSale(!isSale)
  }
  const onPriceClick = () => {
    const newPrice = isPrice === 'up' ? 'down' : 'up'
    setIsSale(false)
    setIsPrice(newPrice)
    onPrice(newPrice)
  }
  return (
    <div className=" flex justify-around py-2">
      <div onClick={onSaleClick} className={isSale ? 'text-red-900' : ''}>
        销量
      </div>
      <div className="flex flex-row" onClick={onPriceClick}>
        <div>价格</div>
        <div className="ml-1">
          <span className={isPrice === 'up' ? 'text-red-900' : ''}>
            <ChevronUp />
          </span>
          <span className={isPrice === 'down' ? 'text-red-900' : ''}>
            <ChevronDown />
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <div>筛选</div>
        <div className="ml-1 text-gray-500">
          <Filter />
        </div>
      </div>
    </div>
  )
}
export default Toolbal

export interface Cart {
  goodsId: number
  skuId: number
  count: number
  selected: number
}

export interface CartProduct {
  count: number
  goodsId: number
  goodsName: string
  image: string
  price: number
  selected: number
  skuId: number
}

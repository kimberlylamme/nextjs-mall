export interface Product {
  goodsId: number
  goodsName: string
  price: number
  marketPrice: number
  image: string
  images: string[]
  sales: number
  stock: number
  skuTrees: SkuTree[]
  skus: Sku[]
}

export interface SkuTree {
  id: number
  name: string
  childs: SkuChild[]
}

export interface SkuChild {
  itemId: number
  name: string
}

export interface Sku {
  skuId: number
  key: string[]
  name: string
  price: number
  stock: number
  image: string
}

export interface ParamProducts {
  page: number
  keyWord?: string
  price?: string
  sales?: string
}

export interface SelectSku {
  skuId: number
  skuName: string
  image: string
  price: number
  stock: number
  count: number
}

export interface GoodsContext {
  isShowSku: boolean
  setIsShowSku(state: boolean): void
  matchSku: any
  setMatchSku(sku: any): void
  status: number
  setStatus(count: number): void
  skuTrees: SkuTree[]
  setSkuTrees(array: SkuTree[]): void
  skus: Sku[]
  setSkus(array: Sku[]): void
  selectSku: SelectSku
  setSelectSku(sku: SelectSku): void
}

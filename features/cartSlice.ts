import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../app/store'
import { Cart, CartProduct } from '../interfaces/carts'
import { Product } from '../interfaces/goods'

interface initType {
  cartList: CartProduct[]
  cartListStatus: string
}

const initalState: initType = {
  cartList: [],
  cartListStatus: 'idle',
}

// 购物车列表
export const fetchCartList = createAsyncThunk('cart/fetchCartList', async (products: Product[]) => {
  const copyProducts: Product[] = JSON.parse(JSON.stringify(products))
  const lists = JSON.parse(localStorage.getItem('cart-list') || '[]')
  console.log('lists', lists)
  if (lists.length === 0) return []
  lists.map((list: any) => {
    list.goodsName = ''
    list.image = ''
    list.price = 0.0
    const product = copyProducts.find((product) => list.goodsId === product.goodsId)
    if (!product) return list
    list.goodsName = product.goodsName
    list.image = product.image
    list.price = product.price
    const sku = product.skus?.find((sku) => sku.skuId === list.skuId)
    if (!sku) return list
    list.image = sku.image
    list.price = sku.price
    return list
  })
  return lists
})

interface paramAddCart {
  goodsId: number
  count: number
  skuId: number
}
export const fetchAddCart = createAsyncThunk(
  'cart/fetchAddCart',
  async ({ products, params }: { products: Product[]; params: paramAddCart }) => {
    const copyProducts: Product[] = JSON.parse(JSON.stringify(products))
    const cartLists = JSON.parse(localStorage.getItem('cart-list') || '[]')
    const copyCartLists = JSON.parse(JSON.stringify(cartLists))
    const product = copyProducts?.find((product: Product) => product.goodsId === params.goodsId)
    if (!product) return { code: 0, message: '没有该商品' }
    const sku = product.skus?.find((sku) => sku.skuId === params.skuId)

    if (cartLists.length > 0) {
      const cartInfo = copyCartLists.find(
        (list: Cart) => list.goodsId === params.goodsId && list.skuId === params.skuId,
      )
      if (cartInfo) {
        cartInfo.count = cartInfo.count + params.count
        if (!sku && product.stock < cartInfo.count) return { code: 0, message: '库存不足' }
        if (sku && sku.stock < cartInfo.count) return { code: 0, message: '库存不足' }
        localStorage.setItem('cart-list', JSON.stringify(copyCartLists))
        return { code: 1, message: '操作成功' }
      }
    }

    if (!sku && product.stock < params.count) return { code: 0, message: '库存不足' }
    if (sku && sku.stock < params.count) return { code: 0, message: '库存不足' }
    const addCart = {
      goodsId: params.goodsId,
      skuId: params.skuId,
      count: params.count,
      selected: 0,
    }
    console.log(addCart)
    localStorage.setItem('cart-list', JSON.stringify([...cartLists, addCart]))
    return { code: 1, message: '操作成功' }
  },
)

export const fetchUpdateCart = createAsyncThunk(
  'cart/fetchUpdateCart',
  async (params: CartProduct[]) => {
    if (params.length > 0) localStorage.setItem('cart-list', JSON.stringify(params))
    return { code: 1, message: '操作成功' }
  },
)

interface paramDelcart {
  goodsId: number
  skuId: number
}
export const fetchDelCart = createAsyncThunk('cart/fetchDelCart', async (params: paramDelcart) => {
  const cartLists = JSON.parse(localStorage.getItem('cart-list') || '[]')
  const lists = cartLists.filter(
    (cart: Cart) => !(cart.goodsId === params.goodsId && cart.skuId === params.skuId),
  )
  lists.length > 0
    ? localStorage.setItem('cart-list', JSON.stringify(lists))
    : localStorage.setItem('cart-list', '')
  return { code: 1, message: '删除成功' }
})

export const fetchSelectCart = createAsyncThunk(
  'cart/fetchSelectCart',
  async (params: CartProduct[]) => {
    if (params.length > 0) localStorage.setItem('cart-list', JSON.stringify(params))
    return { code: 1, message: '操作成功' }
  },
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initalState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCartList.fulfilled, (state, action) => {
      state.cartList = action.payload
      state.cartListStatus = 'sucessed'
    })
  },
})

export const cartList = (state: AppState) => state.cart.cartList
export default cartSlice.reducer

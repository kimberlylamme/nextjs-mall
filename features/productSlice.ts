import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ParamProducts, Product } from '../interfaces/goods'
import { AppState } from '../app/store'

interface initalType {
  products: Product[]
  loading: boolean
  productInfo: any
  allProducts: Product[]
}

const initalState: initalType = {
  products: [],
  loading: true,
  productInfo: {},
  allProducts: [],
}

export const fetchAllProducts = createAsyncThunk('goods/fetchAllProducts', async () => {
  const url = '/api/goods'
  const res = await fetch(url)
  return res.json()
})

// 商品列表
export const fetchProducts = createAsyncThunk(
  'goods/fetchProducts',
  async (params: ParamProducts) => {
    const page = params.page
    const url = '/api/goods'
    const res = await fetch(url)
    let products: Product[] = await res.json()
    if (params.keyWord && params.keyWord.length > 0) {
      const keyWord = params.keyWord.toLowerCase()
      products = products?.filter((product) => product.goodsName.includes(keyWord))
    }
    if (params.price || params.sales) {
      products = products?.sort((a: any, b: any) => {
        if (params.price) return params.price === 'up' ? a.price - b.price : b.price - a.price
        return params.price === 'up' ? a.sales - b.sales : b.sales - a.sales
      })
    }
    return { page: page, data: products?.slice(page * 10 - 10, page * 10) }
  },
)

// 商品详情
export const fetchProductInfo = createAsyncThunk(
  'goods/fetchProductInfo',
  async ({ goodsId }: { goodsId: number }) => {
    const url = '/api/goods'
    const res = await fetch(url)
    const products: Product[] = await res.json()
    const info = products.find((product) => product.goodsId === goodsId)
    return info
  },
)

export const goodsSlice = createSlice({
  name: 'products',
  initialState: initalState,
  reducers: {
    isLoad: (state) => {
      state.loading = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.products = action.payload.data
        } else {
          state.products = state.products.concat(action.payload.data)
        }
        state.loading = action.payload.data.length !== 10 ? false : true
      })
      .addCase(fetchProductInfo.fulfilled, (state, action) => {
        state.productInfo = action.payload
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload
      })
  },
})
export const { isLoad } = goodsSlice.actions
export const storeProducts = (state: AppState) => state.products.products
export const storeProductInfo = (state: AppState) => state.products.productInfo
export default goodsSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ParamProducts, Product } from '../interfaces/goods'
import { AppState } from '../app/store'

interface initalType {
  products: Product[]
  loading: boolean
  productInfo: Product
  filterProducts: Product[]
}

const initalState: initalType = {
  products: [],
  loading: true,
  productInfo: {
    goodsId: 0,
    goodsName: '',
    price: 0,
    marketPrice: 0,
    image: '',
    images: [],
    sales: 0,
    stock: 0,
    skuTrees: [],
    skus: [],
  },
  filterProducts: [],
}

export const fetchProducts = createAsyncThunk('goods/fetchProducts', async () => {
  const url = 'http://localhost:3000/api/goods'
  const res = await fetch(url)
  return res.json()
})

// 商品列表
interface filterProducts {
  products: Product[]
  params: ParamProducts
}
export const fetchFilterProducts = createAsyncThunk(
  'goods/fetchFilterProducts',
  async ({ products, params }: filterProducts) => {
    const page = params.page
    let copyProducts = JSON.parse(JSON.stringify(products))
    if (params.keyWord && params.keyWord.length > 0) {
      const keyWord = params.keyWord.toLowerCase()
      copyProducts = copyProducts?.filter((product: Product) => product.goodsName.includes(keyWord))
    }
    if (params.price || params.sales) {
      copyProducts = copyProducts?.sort((a: any, b: any) => {
        if (params.price) return params.price === 'up' ? a.price - b.price : b.price - a.price
        return params.sales === 'up' ? a.sales - b.sales : b.sales - a.sales
      })
    }
    return { page: page, data: copyProducts?.slice(page * 10 - 10, page * 10) }
  },
)

// 商品详情
export const fetchProductInfo = createAsyncThunk(
  'goods/fetchProductInfo',
  async ({ products, goodsId }: { products: Product[]; goodsId: number }) => {
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
        state.products = action.payload
      })
      .addCase(fetchFilterProducts.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.filterProducts = action.payload.data
        } else {
          state.filterProducts = state.filterProducts.concat(action.payload.data)
        }
        state.loading = action.payload.data.length !== 10 ? false : true
      })
      .addCase(fetchProductInfo.fulfilled, (state, action) => {
        if (action.payload) state.productInfo = action.payload
      })
  },
})
export const { isLoad } = goodsSlice.actions
export const storeFilterProducts = (state: AppState) => state.products.filterProducts
export const storeProductInfo = (state: AppState) => state.products.productInfo
export default goodsSlice.reducer

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import bannerReducer from '../features/bannerSlice'
import productReducer from '../features/productSlice'
import cartReducer from '../features/cartSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      banner: bannerReducer,
      products: productReducer,
      cart: cartReducer,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>
export default store

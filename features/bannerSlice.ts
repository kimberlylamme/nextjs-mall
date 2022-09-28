import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../app/store'

// 轮播图
export const fetchAd = createAsyncThunk('home/fetchAd', async () => {
  const url = 'http://localhost:3000/api/banner'
  const res = await fetch(url)
  return res.json()
})

const initalState = {
  adLists: [],
  loading: true,
}
export const bannerSlice = createSlice({
  name: 'banner',
  initialState: initalState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAd.fulfilled, (state, action) => {
      state.adLists = action.payload
      state.loading = false
    })
  },
})

export const adLists = (state: AppState) => state.banner.adLists

export default bannerSlice.reducer

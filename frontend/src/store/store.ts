import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import customersReducer from './slices/customersSlice'
import jobsReducer from './slices/jobsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customersReducer,
    jobs: jobsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

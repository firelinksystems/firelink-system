import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Jobs from './pages/Jobs'
import Scheduling from './pages/Scheduling'
import Financial from './pages/Financial'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="scheduling" element={<Scheduling />} />
        <Route path="financial" element={<Financial />} />
      </Route>
    </Routes>
  )
}

export default App

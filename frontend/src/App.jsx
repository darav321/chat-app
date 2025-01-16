import { useState } from 'react'
import { Router, Route, BrowserRouter, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MessagePage from './components/MessagePage'
import AuthLayout from './pages/AuthLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Home />}>
        <Route path='/:userid' element={<MessagePage />}></Route>
      </Route>
      <Route path='/login' element={<AuthLayout><Login /></AuthLayout>}></Route>
      <Route path='/register' element={<AuthLayout><Register /></AuthLayout>}></Route>
    </Routes>    
  )
}

export default App

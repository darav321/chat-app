import React from 'react'
import logo from '../assets/logo.png'

const AuthLayout = ({children}) => {
  return (
    <>
    <header className='flex justify-center items-center py-2 shadow-lg'>
        <img src={logo} alt="" className='w-40 h-18' />
        <h1 className='text-4xl font-bold text-slate-800'>ChatMore</h1>
    </header>
    <section className='min-h-[calc(100vh-109px)] w-full flex items-center justify-center'>
        {children}
    </section>
    </>
  )
}

export default AuthLayout

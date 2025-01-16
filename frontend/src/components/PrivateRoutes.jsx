import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
    const isAuth = localStorage.getItem('token')

    return isAuth ? children : <Navigate to="/login" replace />
}

export default PrivateRoutes

import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
    const user = useSelector(state => state.user._id)

    if(user) {
        return children
    }
  return <Navigate to={'/login'} replace/>
}

export default PrivateRoutes

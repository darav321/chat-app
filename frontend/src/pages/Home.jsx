import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import { setUser, setOnlineUser, setSocketConnection } from '../../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {

  const dispatch = useDispatch()
  const loaction = useLocation()
  const basePath = loaction.pathname === '/'
  const user = useSelector(state => state.user._id)
  const fetchUserDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/userDetail`

      const response = await axios({
        url : url,
        withCredentials : true
      })
      dispatch(setUser(response.data.data))
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    setTimeout(fetchUserDetails(), 500)
  },[])

  useEffect(() => {
    const socketConnection = io("https://chat-app-vuuf.onrender.com", {
      withCredentials: true,
      auth: { token: localStorage.getItem("token") },
    });

    dispatch(setSocketConnection(socketConnection));
  
    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data)); 
    });
  
  
    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);
  
  return (

    <div className='flex flex-row w-screen h-screen max-h-screen'>
      <section className={`bg-slate-100 w-full sm:w-full lg:max-w-[25%] md:w-[37%] ${!basePath && "hidden"} md:block`}>
        <Sidebar />
      </section>
    

      <section className={`${basePath || !user && "hidden"} lg:w-[75%] md:w-[63%] sm:w-full `}>
        <Outlet />
      </section>

      <div className={`hidden ${!basePath && 'hidden'}`}>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-row items-center justify-center'>
            <img src={logo} alt="" className='w-40 h-18' />
            <h1 className='text-4xl font-bold text-slate-800'>ChatMore</h1>
          </div>
          <p className='text-base font-medium text-gray-600'>Select user to start chatting</p>
        </div>
      </div>

    </div>
  )
}

export default Home

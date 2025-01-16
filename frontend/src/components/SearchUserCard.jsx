import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const SearchUserCard = ({user, onClose}) => {
  return (
    <>
    <Link to={"/"+user._id} onClick={()=>onClose()} className='flex flex-row gap-3 px-8 py-5 items-center cursor-pointer hover:bg-slate-200'>
      <div>
        <Avatar 
            width={45}
            height={45}
            name={user.name}
            imageURL={user.profilePic}
            userId={user._id}
        />
      </div>
      <div>
        <p className='text-xl font-medium text-slate-600'>{user.name}</p>
        <p className='text-sm text-slate-600'>{user.email}</p>
      </div>
      
    </Link>
    <div className="bg-gray-400 p-[0.4px]"></div>
    </>
  )
}

export default SearchUserCard

import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    name : "",
    email : "",
    profilePic : "",
    token : "",
    _id : "",
    onlineUser : [],
    socketConnection : null,
}

export const userSlice = createSlice({
    name : 'counter',
    initialState,
    reducers : {
        setUser : (state, action) => {
            state._id = action.payload._id
            state.name = action.payload.name
            state.email = action.payload.email
            state.profilePic = action.payload.profilePic 
        },
        setToken : (state, action) => {
            state.token = action.payload
        },
        logOut : (state) => {
            state._id = "",
            state.name = "",
            state.profilePic = "",
            state.email = "",
            state.token = "",
            state.onlineUser = []
            state.socketConnection = null
        },
        setOnlineUser : (state,action) => {
            state.onlineUser = action.payload
        },
        setSocketConnection : (state, action) => {
            state.socketConnection = action.payload
        }
    }
})

export const {setUser, setToken, logOut, setOnlineUser, setSocketConnection} = userSlice.actions 

export default userSlice.reducer
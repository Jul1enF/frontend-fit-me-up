import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : [],
}

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        login : (state, action)=>{
            state.value = action.payload
        },
        logout : (state, action)=>{
            state.value = []
        },
        changePushToken : (state, action)=>{
            state.value.push_token = action.payload
        },
    }
})

export const { login, changePushToken, logout } = userSlice.actions
export default userSlice.reducer
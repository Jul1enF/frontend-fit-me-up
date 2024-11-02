import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : [],
}

export const cronsNotificationsSlice = createSlice({
    name : 'cronsNotifications',
    initialState,
    reducers : {
        addCronsNotifications : (state, action)=>{
            state.value = []
            state.value = action.payload
        },
        addOneCronNotification : (state, action)=>{
            state.value.push(action.payload)
        },
        modifyCronNotification : (state, action) => {
            state.value = state.value.map(e=> {
                if (e._id === action.payload._id){
                    return action.payload
                }else { return e }
            })
        },
        deleteCronNotification : (state, action)=>{
            state.value = state.value.filter(e => e._id !== action.payload)
        },
    }
})

export const { addCronsNotifications, modifyCronNotification,  addOneCronNotification, deleteCronNotification } = cronsNotificationsSlice.actions
export default cronsNotificationsSlice.reducer
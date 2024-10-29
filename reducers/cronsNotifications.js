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
        modifyCronNotification : (state, action) => {
            state.value = state.value.map(e=> {
                if (e.cron_notification_number === action.payload.cron_notification_number){
                    return action.payload
                }else { return e }
            })
        },
    }
})

export const { addCronsNotifications, modifyCronNotification } = cronsNotificationsSlice.actions
export default cronsNotificationsSlice.reducer
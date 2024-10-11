import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : []
}

export const articlesSlice = createSlice({
    name : "articles",
    initialState,
    reducers : {
        fillWithArticles : (state, action)=>{
            state.value = action.payload
        },
    }
})

export const { fillWithArticles } = articlesSlice.actions
export default articlesSlice.reducer
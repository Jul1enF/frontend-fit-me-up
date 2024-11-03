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
        suppressArticles : (state, action)=>{
            state.value = []
        },
    }
})

export const { fillWithArticles, suppressArticles } = articlesSlice.actions
export default articlesSlice.reducer
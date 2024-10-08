import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value : [],
}

export const testArticlesSlice = createSlice({
    name : 'testArticles',
    initialState,
    reducers : {
        addTestArticle : (state, action)=>{
            state.value.push(action.payload)
        },
    }
})

export const { addTestArticle } = testArticlesSlice.actions
export default testArticlesSlice.reducer
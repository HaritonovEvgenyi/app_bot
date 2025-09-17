import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRepos = createAsyncThunk("github/fetchRepos", async ()=> {
    const res = await fetch("https://api.github.com/users/HaritonovEvgenyi/repos");
    return await res.json();
})

const githubSlice = createSlice({
    name: "github",
    initialState: {repos: [] as any[], loading: false},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRepos.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchRepos.fulfilled, (state, action)=> {
            state.loading = false;
            state.repos = action.payload
        })
    }
})

export default githubSlice.reducer
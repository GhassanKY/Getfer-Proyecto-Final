import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'userState',
  initialState: {
    user: [],
    isAuthenticated: false,
  },
  reducers: {
    setuser: (state, action) => {
      const { option } = action.payload;
      state[option] = action.payload.value;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setuser } = userSlice.actions;
export default userSlice.reducer;

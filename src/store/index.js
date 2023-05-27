import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slice/users/users.slice';

export default configureStore({
  reducer: {
    user: usersSlice,
  },
});

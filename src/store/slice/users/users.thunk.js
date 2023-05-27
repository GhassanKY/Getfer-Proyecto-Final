import { setSession } from '../../../auth/utils';
import axiosInstance from '../../../utils/axios';
import { setuser } from './users.slice';

export const userLogin = (data) => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/users/login', data);
    setSession(res.data.token);
    dispatch(setuser({ option: 'isAuthenticated', value: true }));
    console.log(res.data);
  } catch (error) {
    console.log(error.error);
  }
};

export const userLogout = () => async (dispatch) => {
  dispatch(setuser({ option: 'isAuthenticated', value: false }));
  setSession(null);
};

import { setSession } from '../../../auth/utils';
import axiosInstance from '../../../utils/axios';
import { setuser } from './users.slice';

export const userLogin = (data) => async (dispatch) => {
  try {
    dispatch(setuser({ option: 'isLoading', value: true }));
    dispatch(setuser({ option: 'msgError', value: '' }));
    const res = await axiosInstance.post('/users/login', data);
    console.log(res.data.user);
    setSession(res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    dispatch(setuser({ option: 'user', value: res.data.user }));
    dispatch(setuser({ option: 'isAuthenticated', value: true }));
    dispatch(setuser({ option: 'isLoading', value: false }));
  } catch (error) {
    dispatch(setuser({ option: 'msgError', value: error }));
    dispatch(setuser({ option: 'isLoading', value: false }));
    console.log(error);
  }
};

export const userRegister = (data) => async (dispatch) => {
  try {
    const res = await axiosInstance.post('/customers/register', data);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
  console.log(data);
};

export const userLogout = () => async (dispatch) => {
  dispatch(setuser({ option: 'isAuthenticated', value: false }));
  setSession(null);
};

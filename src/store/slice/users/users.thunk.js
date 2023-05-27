import { setSession } from '../../../auth/utils';
import axiosInstance from '../../../utils/axios';
import { setuser } from './users.slice';

export const userLogin = (data) => async (dispatch) => {
  try {
    dispatch(setuser({ option: 'isLoading', value: true }));
    dispatch(setuser({ option: 'msgError', value: '' }));
    const res = await axiosInstance.post('/users/login', data);
    setSession(res.data.token);
    dispatch(setuser({ option: 'isAuthenticated', value: true }));
    console.log(res.data);
  } catch (error) {
    dispatch(setuser({ option: 'msgError', value: error }));
    dispatch(setuser({ option: 'isLoading', value: false }));
    console.log(error);
  }
};

export const userLogout = () => async (dispatch) => {
  dispatch(setuser({ option: 'isAuthenticated', value: false }));
  setSession(null);
};

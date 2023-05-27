import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { setuser } from '../store/slice/users/users.slice';
// utils
import axiosInstance from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------
// Esta logica nos permite mantener la sesion activa
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRdx = useDispatch();

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      console.log(accessToken);

      if (accessToken) {
        setSession(accessToken);

        // const response = await axiosInstance.get('/Empleado');

        // const { user } = response.data;

        dispatchRdx(setuser({ option: 'isAuthenticated', value: true }));

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable, dispatchRdx]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (user, password) => {
    const res = await axiosInstance.post('/Empleado/Login', {
      user,
      password,
    });

    const { token, idEmpleado, empleado, usuario } = res.data.datos;

    console.log(empleado);

    setSession(token);

    dispatch({
      type: 'LOGIN',
      payload: {
        idEmpleado,
        user: { displayName: empleado.nombre, role: usuario },
      },
    });

    return true;

    // const response = await axios.post('/api/account/login', {
    //   email,
    //   password,
    // });
    // const { accessToken, user } = response.data;

    // setSession(accessToken);

    // dispatch({
    //   type: 'LOGIN',
    //   payload: {
    //     user,
    //   },
    // });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axiosInstance.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

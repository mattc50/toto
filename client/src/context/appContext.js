import React, { useEffect, useReducer, useContext } from 'react';
import reducer from './reducer';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  // PROMPT_FIELD_ERRORS
  GET_TODOS_BEGIN,
  GET_TODOS_SUCCESS,
  EDIT_TODO_BEGIN,

  GET_TODOS_ERROR,

  EDIT_TODO_SUCCESS,
  EDIT_TODO_ERROR,
  CREATE_TODO_BEGIN,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_ERROR,
  DELETE_TODO_BEGIN,
  DELETE_TODO_SUCCESS,
  DELETE_TODO_ERROR,

  CREATE_SET_BEGIN,
  CREATE_SET_SUCCESS,
  CREATE_SET_ERROR,
  GET_SETS_BEGIN,
  GET_SETS_SUCCESS,
  GET_SET_BEGIN,
  GET_SET_SUCCESS,
  EDIT_SET_BEGIN,
  EDIT_SET_SUCCESS,
  EDIT_SET_ERROR,
  DELETE_SET_BEGIN,
  DELETE_SET_SUCCESS,
  DELETE_SET_ERROR,

  CLEAR_FOUND,
  SET_INVALID,
  SET_LOADING,
  REQUEST_RESET_ERROR,
  CHECK_TOKEN_BEGIN,
  CHECK_TOKEN_SUCCESS,
  CHECK_TOKEN_ERROR
} from './actions';
import axios from 'axios';

const AppContext = React.createContext();

export const initialState = {
  // userLoading will be for when the app is refreshed and the user is being retrieved/validated.
  // it is set to true to prevent being immediately logged out.
  userLoading: true,
  userFetched: false,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  showSidebar: false,
  // errors: {},
  todos: [],
  set: null,
  sets: [],
  totalTodos: 0,
  doneTodos: 0,
  editTodoId: '',
  isEditing: false,
  setFound: true,
  setLoading: true,
  tokenLoading: true,
  tokenFound: true
}

const AppProvider = ({ children }) => {

  const authFetch = axios.create({
    baseURL: '/api/v1',
  })

  // request interceptor
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers['Authorization'] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        // console.log('logging out')
        logoutUser();
      }
      if (error.response.status === 404) {
        // console.log('404 thrown')
        dispatch({ type: SET_INVALID })
      }
      return Promise.reject(error);
    }
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT })
    }, 3000);
  }

  const clearAlertInstant = () => {
    dispatch({ type: CLEAR_ALERT })
  }

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      // POST method will be used, as we are sending data to the server
      const response = await axios.post(
        '/api/v1/auth/register', currentUser
      )
      const { user } = response.data
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user }
      })
    } catch (error) {

      // ADDITION:  an action has been added to store any errors raised in 
      //            a new global context value, errors. This list is 
      //            retrieved from the data inside the response when an 
      //            error is raised from the error-handler middleware.
      //            This value is used by the Register and Login forms to 
      //            display validation errors alongside the fields they 
      //            belong to. 
      // dispatch({
      //   type: PROMPT_FIELD_ERRORS,
      //   payload: { errors: error.response.data.list }
      // })

      dispatch({
        type: REGISTER_USER_ERROR,
        payload: {
          msg: error.response.data.msg,
          errors: error.response.data.list
        }
      })
    }
    clearAlert();
  }

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post('/api/v1/auth/login', currentUser);
      const { user } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user }
      })
    } catch (error) {
      // dispatch({
      //   type: PROMPT_FIELD_ERRORS,
      //   payload: { errors: error.response.data.list }
      // })
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {
          msg: error.response.data.msg,
          errors: error.response.data.list
        }
      });
    }
    clearAlert();
  }

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch(
        '/auth/update', currentUser
      )
      const { user } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user }
      });

    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg }
        })
      }
    }
    clearAlert();
  }

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user } = data
      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user }
      })
    } catch (error) {
      if (error.response.status === 401) {
        return;
      }
    };
  }

  const isSetLoading = () => {
    dispatch({ type: SET_LOADING })
  }

  const getTodos = async (setId) => {
    dispatch({ type: GET_TODOS_BEGIN })
    try {
      const { data } = await authFetch(`/todo/all/${setId}`)

      const {
        todos,
        totalTodos,
        doneTodos,
        todosOfSet,
        todoIdsInSet,
        // nullsFiltered, 
        set
      } = data;

      const nullsFiltered = todoIdsInSet
        .filter(todo => todosOfSet.some(el => el === todo))

      if (nullsFiltered.length > 0 && todoIdsInSet.length !== todosOfSet.length)
        await authFetch.patch(`/set/${setId}`, { todos: nullsFiltered })
      dispatch({
        type: GET_TODOS_SUCCESS,
        payload: { setId, todos, totalTodos, doneTodos, set }
      })
    } catch (error) {
      dispatch({ type: GET_TODOS_ERROR })
      if (error.response.status === 404) {
        return;
      }
    }
  }

  const getAllTodos = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    dispatch({ type: GET_TODOS_BEGIN })
    try {
      const { data } = await authFetch(`/todo/all`, { signal: signal })
      const { todos, totalTodos, doneTodos } = data;
      dispatch({
        type: GET_TODOS_SUCCESS,
        payload: { todos, totalTodos, doneTodos }
      })
      controller.abort()
    } catch (error) {
      dispatch({ type: GET_TODOS_ERROR })
      if (error.response.status === 404) {
        return;
      }
    }
  }

  const updateStatus = async (
    id,
    status,
    item,
    animIn,
    setId
  ) => {
    const el = document.getElementById(`todo-${item}`);

    // const animIn = status ? 'c-in-in' : 'c-out-in'
    el.classList.add(animIn);

    dispatch({ type: EDIT_TODO_BEGIN })

    try {
      await authFetch.patch(`/todo/${id}`, { status })

      dispatch({ type: EDIT_TODO_SUCCESS })
      setId ? await getTodos(setId) : await getAllTodos()

      el.classList.remove(animIn);
      const animOut = status ? 'c-in-out' : 'c-out-out'
      el.classList.add(animOut);
      setTimeout(() => {
        el.classList.remove(animOut);
      }, 1000)

    } catch (error) {
      if (error.response.status === 401) {
        return
      }
      dispatch({
        type: EDIT_TODO_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
  }

  const updateTask = async (id, task, setId) => {
    dispatch({ type: EDIT_TODO_BEGIN })

    try {
      await authFetch.patch(`/todo/${id}`, { task })

      dispatch({ type: EDIT_TODO_SUCCESS })

      // new line to check if there is a set or not, which dictates the request to 
      // call
      setId ? await getTodos(setId) : await getAllTodos()

    } catch (error) {
      if (error.response.status === 401) {
        return
      }
      dispatch({
        type: EDIT_TODO_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
  }

  const createTodo = async (task, setId) => {
    dispatch({ type: CREATE_TODO_BEGIN })
    try {
      await authFetch.post('/todo', { task, belongsTo: setId })
      // const todoId = todo.data.todo._id;

      // uncomment back pushSetToTodo when the ability to add Todos to other Sets is 
      // introduced
      // await pushSetToTodo(todoId, setId)

      // await pushTodoToSet(todoId, setId)
      dispatch({ type: CREATE_TODO_SUCCESS })
      await getTodos(setId)
    } catch (error) {
      console.log(error)
      if (error.response.status === 401) {
        return
      }
      dispatch({
        type: CREATE_TODO_ERROR,
        payload: {
          msg: error.response.data.msg
        }
      })
    }
  }

  const deleteTodo = async (todoId, setId) => {
    dispatch({ type: DELETE_TODO_BEGIN });
    try {
      // if we want to include the ability to delete Todos from the Todos page, we 
      // need to get the Set of the Todo to be deleted, which requires a request.

      // let set = [];
      // if (!setId) {
      //   const todo = await authFetch(`todo/${todoId}`);
      //   set = todo.data.todo.belongsTo;
      //   for (const el in set) {
      //     await popTodoFromSet(todoId, set[el]);
      //   }
      // }

      // if (setId) {

      // popTodoFromSet has been commented out due to the following:
      // when getTodos(setId) are retrieved after a Todo is deleted, no null Todos 
      // will come with the response. Given that this happens, we can simply use the 
      // getTodos response to determine which Todos should be filtered out of the 
      // todos array sent when the Set is updated.
      // await popTodoFromSet(todoId, setId);

      // }

      await authFetch.delete(`todo/${todoId}`);
      dispatch({ type: DELETE_TODO_SUCCESS })
      setId ? await getTodos(setId) : await getAllTodos()
    } catch (error) {
      if (error.response.status === 401) {
        return;
      }
      dispatch({
        type: DELETE_TODO_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
  }

  const createSet = async () => {
    dispatch({ type: CREATE_SET_BEGIN })
    try {
      await authFetch.post('/set')

      dispatch({ type: CREATE_SET_SUCCESS })
      await getSets();
    } catch (error) {
      if (error.response.status === 401) {
        return
      }
      dispatch({
        type: CREATE_SET_ERROR,
        payload: {
          msg: error.response.data.msg
        }
      })
    }
  }

  const getSets = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    dispatch({ type: GET_SETS_BEGIN })
    try {
      const { data } = await authFetch('/set', { signal: signal })
      const { sets } = data;
      dispatch({
        type: GET_SETS_SUCCESS,
        payload: { sets }
      })
      controller.abort()
    } catch (error) {
      logoutUser()
    }
  }

  const getSet = async (setId) => {
    dispatch({ type: GET_SET_BEGIN })
    try {
      const { data } = await authFetch(`/set/${setId}`)
      const { set } = data;
      dispatch({
        type: GET_SET_SUCCESS,
        payload: { set }
      })
    } catch (error) {
      if (error.response.status === 404) {
        return;
      }
    }
  }

  const updateName = async (id, name) => {
    dispatch({ type: EDIT_SET_BEGIN })

    try {
      await authFetch.patch(`/set/${id}`, { name })

      dispatch({ type: EDIT_SET_SUCCESS })

    } catch (error) {
      if (error.response.status === 401) {
        return
      }
      dispatch({
        type: EDIT_SET_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
  }

  const deleteSet = async (setId) => {
    dispatch({ type: DELETE_SET_BEGIN });
    try {
      // await authFetch.delete(`/todo/all/${setId}`);
      await authFetch.delete(`/set/${setId}`)
      dispatch({ type: DELETE_SET_SUCCESS })
      await getSets();
    } catch (error) {
      dispatch({
        type: DELETE_SET_ERROR,
        payload: { msg: error.response.data.msg }
      })
      if (error.response.status === 404) {
        return;
      }
      logoutUser()
    }
  }

  const clearFound = () => {
    dispatch({ type: CLEAR_FOUND })
  }

  const requestPasswordReset = async (email) => {
    try {
      await authFetch.post('/forgot-password/request-reset', { email })
    } catch (error) {
      dispatch({
        type: REQUEST_RESET_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert();
  }

  const resetPassword = async (userId, token, password) => {
    try {
      await authFetch.post('/forgot-password/reset-password', { userId, token, password })
    } catch (error) {
      dispatch({
        type: REQUEST_RESET_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert();
  }

  const checkToken = async (token, userId) => {
    try {
      dispatch({ type: CHECK_TOKEN_BEGIN })
      // token and userId are sent in as query parameters, since GET requests do not 
      // have bodies
      const { data } = await authFetch(`/forgot-password/reset-password/${token}/${userId}`)
      if (data) {
        dispatch({ type: CHECK_TOKEN_SUCCESS })
        return true;
      }
    } catch (error) {
      dispatch({ type: CHECK_TOKEN_ERROR })
      return false;
    }
  }

  useEffect(() => {
    getCurrentUser()
    //eslint-disable-next-line
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlertInstant,
        registerUser,
        loginUser,
        logoutUser,
        toggleSidebar,
        updateUser,

        getTodos,
        getAllTodos,
        updateStatus,
        updateTask,
        createTodo,
        deleteTodo,

        createSet,
        getSets,
        getSet,
        updateName,
        deleteSet,

        clearFound,
        isSetLoading,

        requestPasswordReset,
        resetPassword,
        checkToken
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };

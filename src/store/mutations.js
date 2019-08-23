export const setIsAuthenticate = (state, data) => {
  state.isAuthenticate = data
  window.localStorage.setItem('isAuthenticate', data)
}

export const setUserName = (state, data) => {
  state.username = data
  window.localStorage.setItem('username', data)
}

export const setRole = (state, data) => {
  state.role = data
  window.localStorage.setItem('role', data)
}

export const setToken = (state, data) => {
  state.token = data
  window.localStorage.setItem('token', data)
}

export const setRoutes = (state, data) => {
  state.allroutes = data
  window.localStorage.setItem('allroutes', data)
}


export const setPasstime = (state, data) => {
  let pastTime = 1 * 24 * 60 * 60 * 1000
  state.passtime = data + pastTime
  window.localStorage.setItem('passtime', data + pastTime)
}

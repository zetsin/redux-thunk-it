# react-thunk-it
Format your stores, actions, reducers in react-redux

## Installation
Install with npm:
```javascript
npm install react-thunk-it
```

## Example

1. ./index.js
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'react-thunk-it'

import App from './App'
import stores from './stores'

const store = createStore(
  combineReducers(models),
  applyMiddleware(thunk),
)

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))
```

2. ./stores/index.js
```js
import { combineReducers, thunkActions } from 'react-thunk-it'

import test1 from './test1'
import test2 from './test2'

export default combineReducers({
  test1,
  test2
})

export const Test1 = thunkActions(test1)
export const Test2 = thunkActions(test2)
```

3. ./stores/test1.js *&* ./stores/test2.js
```js
export default {
  state: {
    data: {},
    loading: false,
    err: ''
  },

  actions: {
    get_something: function (message = '') {
      const { dispatch, getState } = this

      dispatch({
        type: 'test/save',
        payload: {
          loading: true
        }
      })

      fetch('http://localhost/something')
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'test/save',
          payload: {
            data,
            loading: false
          }
        })
      })
      .catch(err => {
        dispatch({
          type: 'test/save',
          payload: {
            loading: false
            err,
          }
        })
      })

      
    }
  },

  reducers: {
    save: (state, payload) => {
      return {
        ...state,
        ...payload
      }
    }
  }
}
```

4. ./App.js
```jsx
import { connect } from 'react-redux'
import { Test1, Test2 } from './models'

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props

    dispatch(Test1.get_something('xxx'))
  }
  render() {
    const { test1, test2 } = this.props

    cosole.log(test1, test2)

    return (
      <div />
    );
  }
}

export default connect(state => state)(App)
```

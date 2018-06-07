import thunk from 'redux-thunk'

export function combineReducers(models) {
  const reducers = {}
  Object.keys(models).forEach(name => {
    const model = models[name]
    model.state = model.state || {}
    model.reducers = model.reducers || {}

    reducers[name] = function(state = model.state, action) {
      const [target, type] = action.type.split('/')
      const reducer = model.reducers[type]
      if(target === name) {
        if(reducer) {
          return reducer(state, action.payload)
        }
        else {
          throw new Error('Reducer Not Found')
        }
      }
      else if(target === '') {
        if(reducer) {
          return reducer(state, action.payload)
        }
      }
      return state
    }
  })
  return reducers
}

export function thunkActions(model) {
  const actions = {}

  Object.keys(model.actions || {}).forEach(name => {
    actions[name] = function(...args) {
      return (dispatch, getState, extraArgument={}) => {
        Object.assign(this, extraArgument)
        Object.assign(this.props={}, getState(), { dispatch })
        return model.actions[name].call(this, ...args)
      }
    }
  })

  return actions
}

export default thunk

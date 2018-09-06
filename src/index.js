import thunk from 'redux-thunk'

export function combineReducers(models) {
  return Object.keys(models).reduce((reducers, name) => {
    const model = models[name]
    model.name = name
    model.state = model.state || {}
    model.reducers = model.reducers || {}
    model.state.loading = {}

    reducers[name] = function(state = model.state, action={}) {
      const { type=`${model.name}/`, payload } = action
      const [ model_name, reducer_type ] = type.split('/')
      const reducer = model.reducers[reducer_type]

      if(model_name === name) {
        if(reducer) {
          return reducer(state, payload)
        }
        else if(payload) {
          return Object.assign({}, state, payload)
        }
      }
      else if(model_name === '') {
        if(reducer) {
          return reducer(state, payload)
        }
      }
      return state
    }
    return reducers
  }, {})
}

export function thunkActions(model) {
  return Object.keys(model.actions || {}).reduce((actions, name) => {
    actions[name] = function(...args) {
      return (dispatch, getState, extraArgument={}) => {
        const state = getState()
        Object.assign(this, extraArgument)
        Object.assign(this.props={}, state, { dispatch })

        const result = model.actions[name].call(this, ...args)
        const load = loading => dispatch({
          type: model.name,
          payload: {
            loading: Object.assign({}, state.loading, {
              [name]: loading
            })
          }
        })

        if(result instanceof Promise) {
          load(true)
          return result.then(result => {
            load(false)
            return result
          }, error => {
            load(false)
            return error
          })
        }
        else {
          return result
        }
      }
    }
    return actions
  }, {})
}

export default thunk

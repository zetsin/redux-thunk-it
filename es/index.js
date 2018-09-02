'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.combineReducers = combineReducers;
exports.thunkActions = thunkActions;

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function combineReducers(models) {
  return Object.keys(models).reduce(function (reducers, name) {
    var model = models[name];
    model.name = name;
    model.state = model.state || {};
    model.reducers = model.reducers || {};

    reducers[name] = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : model.state;
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _action$type = action.type,
          type = _action$type === undefined ? model.name + '/' : _action$type,
          payload = action.payload;

      var _type$split = type.split('/'),
          _type$split2 = _slicedToArray(_type$split, 2),
          model_name = _type$split2[0],
          reducer_type = _type$split2[1];

      var reducer = model.reducers[reducer_type];
      if (model_name === name) {
        if (reducer) {
          return reducer(state, payload);
        } else if (payload) {
          return Object.assign({}, state, payload);
        }
      } else if (model_name === '') {
        if (reducer) {
          return reducer(state, payload);
        }
      }
      return state;
    };
    return reducers;
  }, {});
}

function thunkActions(model) {
  return Object.keys(model.actions || {}).reduce(function (actions, name) {
    actions[name] = function () {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return function (dispatch, getState) {
        var extraArgument = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var state = getState();
        Object.assign(_this, extraArgument);
        Object.assign(_this.props = {}, state, { dispatch: dispatch });
        return Promise.resolve().then(function () {
          return dispatch({
            type: model.name,
            payload: {
              loading: Object.assign({}, state.loading, _defineProperty({}, name, true))
            }
          });
        }).then(function () {
          var _model$actions$name;

          return (_model$actions$name = model.actions[name]).call.apply(_model$actions$name, [_this].concat(args));
        }).then(function (result) {
          dispatch({
            type: model.name,
            payload: {
              loading: Object.assign({}, state.loading, _defineProperty({}, name, false))
            }
          });
          return result;
        });
      };
    };
    return actions;
  }, {});
}

exports.default = _reduxThunk2.default;
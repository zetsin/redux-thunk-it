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

function combineReducers(models) {
  var reducers = {};
  Object.keys(models).forEach(function (name) {
    var model = models[name];
    model.state = model.state || {};
    model.reducers = model.reducers || {};

    reducers[name] = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : model.state;
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (action.type) {
        var _action$type$split = action.type.split('/'),
            _action$type$split2 = _slicedToArray(_action$type$split, 2),
            target = _action$type$split2[0],
            type = _action$type$split2[1];

        var reducer = model.reducers[type];
        if (target === name) {
          if (reducer) {
            return reducer(state, action.payload);
          } else {
            throw new Error('Reducer Not Found');
          }
        } else if (target === '') {
          if (reducer) {
            return reducer(state, action.payload);
          }
        }
      }
      return state;
    };
  });
  return reducers;
}

function thunkActions(model) {
  var actions = {};

  Object.keys(model.actions || {}).forEach(function (name) {
    actions[name] = function () {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return function (dispatch, getState) {
        var _model$actions$name;

        var extraArgument = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        Object.assign(_this, extraArgument);
        Object.assign(_this.props = {}, getState(), { dispatch: dispatch });
        return (_model$actions$name = model.actions[name]).call.apply(_model$actions$name, [_this].concat(args));
      };
    };
  });

  return actions;
}

exports.default = _reduxThunk2.default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateLoginInput = exports.default = void 0;

var _User = _interopRequireDefault(require("../../models/User"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _apolloServer = require("apollo-server");

var _config = require("../../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var query = {
  Mutation: {
    login(_, _ref) {
      return _asyncToGenerator(function* () {
        var {
          username,
          password
        } = _ref;
        console.log("login");
        var user = yield _User.default.findOne({
          username
        });

        if (!user) {
          console.log("error");
        }

        var match = yield _bcryptjs.default.compare(password, user.password);

        if (!match) {
          console.log("erorr");
        }

        var token = _jsonwebtoken.default.sign({
          id: user.id,
          email: user.email,
          username: user.username
        }, _config.SECRET_KEY, {
          expiresIn: "1h"
        });

        return _objectSpread(_objectSpread({}, user._doc), {}, {
          id: user._id,
          token
        });
      })();
    },

    register(_, _ref2, context, info) {
      return _asyncToGenerator(function* () {
        var {
          registerInput: {
            username,
            email,
            password,
            confirmPassword
          }
        } = _ref2;
        var user = yield _User.default.findOne({
          username
        });

        if (user) {
          throw new _apolloServer.UserInputError("username is token", {
            errors: {
              username: "this username is take"
            }
          });
        }

        password = yield _bcryptjs.default.hash(password, 12);
        var newUser = new _User.default({
          username,
          email,
          password,
          createAt: new Date().toISOString()
        });
        var res = yield newUser.save();

        var token = _jsonwebtoken.default.sign({
          id: res.id,
          email: res.email,
          username: res.username
        }, _config.SECRET_KEY, {
          expiresIn: "1h"
        });

        return _objectSpread(_objectSpread({}, res._doc), {}, {
          id: res._id,
          token
        });
      })();
    }

  }
};
var _default = query;
exports.default = _default;

var validateLoginInput = (username, password) => {};

exports.validateLoginInput = validateLoginInput;
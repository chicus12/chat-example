'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _usersMock = require('../users-mock.json');

var _usersMock2 = _interopRequireDefault(_usersMock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var router = (0, _express.Router)();

  router.get('/user', function (req, res) {
    var user = _usersMock2.default.filter(function (userObject) {
      return userObject.username === req.query.username;
    });
    req.session.currentUser = user[0];
    return res.json(user[0]);
  });

  return router;
};
//# sourceMappingURL=index.js.map
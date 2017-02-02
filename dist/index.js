'use strict';

require('babel-polyfill');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes/');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_express2.default.static(__dirname + '/public'));
app.use((0, _expressSession2.default)({ secret: 'Kaso122@', cookie: {} }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
    var users;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _fs.readFile)(_path2.default.join(__dirname, '/users-mock.json'), {});

          case 3:
            users = _context.sent;

            console.log(users);
            _context.next = 7;
            return JSON.parse(users);

          case 7:
            users = _context.sent;

            if (!req.session.currentUser) {
              _context.next = 12;
              break;
            }

            _context.next = 11;
            return users.filter(function (user) {
              return user.username !== req.session.currentUser.username;
            });

          case 11:
            users = _context.sent;

          case 12:
            return _context.abrupt('return', res.render('index', { title: 'Osom Chat', users: users }));

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', console.log(_context.t0));

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 15]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

app.use('/api', (0, _routes2.default)());

app.listen(_config2.default.port, function (err) {
  if (err) return console.error('A error ocurred trying lift the express: ' + err);

  return console.log('Chat server running on port ' + _config2.default.port);
});
//# sourceMappingURL=index.js.map
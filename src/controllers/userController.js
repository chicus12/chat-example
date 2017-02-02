import User from '../models/User'

const userCtrl = {
  getUsers: (req, res) => {
    let filter = {}

    if (req.session.currentUser) filter = { username: { $ne: req.session.currentUser.username } }

    User
      .find(filter)
      .exec((err, users) => res.render('index', { title: 'Osom Chat', users, currentUser: req.session.currentUser }))
  },

  postUser: (req, res) => {
    User
      .create(req.body, (err, user) => {
        if (err) console.log(err)
        return res.json(user)
      })
  },

  putUser: (req, res) => {
    let data = req.body
    delete data.id

    if (req.body.onlyStatus) {
      if (!req.session.currentUser) return res.status(400).json({ response: 'No changes' })
      data = { status: req.body.status }
    }

    return User
      .update(
        { id: req.body.id || req.session.currentUser },
        data,
        (err, user) => {
          req.session.currentUser.status = data.status
          res.io.emit('status:change', req.session.currentUser);
          return res.json(user)
        },
      )
  },

  activeUser: (req, res) => {
    console.log(req.params.id)
    User
      .findById(req.params.id)
      .exec((err, user) => {
        req.session.currentUser = user
        return res.json(user)
      })
  },
}

export default userCtrl

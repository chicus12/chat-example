import Chat from '../models/Chat'
import helper from '../utils'

const chatCtrl = {
  getChat: (req, res) => {
    const page = req.query.page || 0
    Chat
      .find({
        $and: [
          { $or: [
            {
              user: req.session.currentUser._id, userTo: req.query.user,
            },
            {
              user: req.query.user, userTo: req.session.currentUser._id,
            },
          ] },
        ],
      })
      .populate([{ path: 'user' }, { path: 'userTo' }])
      .limit(10)
      .skip(page * 10)
      .sort({
        createdAt: 'desc',
      })
      .exec((err, chats) => {
        if (err) console.log(err)
        return res.json(chats)
      })
  },

  postVideoChat: (req, res) => {
    const converter = helper.convertVideo(req.body.frames)
    console.log('hello')
    converter.on('log', console.log)

    converter.on('video', (video) => {
      Chat
      .create({
        user: req.session.currentUser._id,
        userTo: req.body.user,
        createdAt: new Date(),
        video,
      }, (err, chat) => {
        if (err) console.log(err)

        Chat.populate(chat, [{ path: 'user' }, { path: 'userTo' }], (err2, chatRe) => {
          res.io.emit('message', chatRe);
          return res.json(chatRe)
        })
      })
    })
  },

  postChat: (req, res) => {
    Chat
      .create({
        user: req.session.currentUser._id,
        userTo: req.body.user,
        message: req.body.message,
        createdAt: new Date(),
      }, (err, chat) => {
        if (err) console.log(err)

        Chat.populate(chat, [{ path: 'user' }, { path: 'userTo' }], (err2, chatRe) => {
          res.io.emit('message', chatRe);
          return res.json(chatRe)
        })
      })
  },
}

export default chatCtrl

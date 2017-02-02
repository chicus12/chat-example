import mongoose from 'mongoose'

const { Schema } = mongoose
const { ObjectId } = Schema

const chatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  video: {
    type: String,
  },
})

export default mongoose.model('Chat', chatSchema)

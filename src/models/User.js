import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  images: {
    avatar: {
      type: String,
      lowercase: true,
      validate: {
        validator: value => (
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)
        ),
        message: '{VALUE} is not a valid avatar image url',
      },
    },
    timeline: {
      type: String,
      lowercase: true,
      validate: {
        validator: value => (
           /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)
        ),
        message: '{VALUE} is not a valid timeline image url',
      },
    },
  },
  status: {
    type: String,
    enum: ['available', 'away', 'inactive'],
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    validate: {
      validator: value => (
        /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/.test(value)
      ),
      message: '{VALUE} is not a valid email',
    },
  },
})

export default mongoose.model('User', userSchema)

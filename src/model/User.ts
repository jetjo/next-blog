export const User = {
  name: {
    type: String,
    unique: true,
  },
  password: String,
  age: Number,
  city: String,
  gender: {
    type: Boolean,
    default: 0, //0:保密 1:男 2:女
  },
};

export const option = {
  timestamps: true,
};

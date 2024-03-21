export const Blog = {
  title: {
    type: String,
  },
  slug: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    unique: true,
  },
};

export const option = {
  timestamps: true,
};

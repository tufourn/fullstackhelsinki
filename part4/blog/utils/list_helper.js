const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, blogs[0])
}

const mostBlogs = (blogs) => {
  return _.chain(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author, blogs }))
    .maxBy('blogs')
    .value()
}

const mostLikes = (blogs) => {
  return _.chain(blogs)
    .groupBy('author')
    .map((blogs, author) => ({ author, likes: _.sumBy(blogs, 'likes') }))
    .maxBy('likes')
    .value()
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
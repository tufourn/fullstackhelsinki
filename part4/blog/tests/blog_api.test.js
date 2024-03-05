const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

let headers

beforeEach(async () => {
  await User.deleteMany({})
  const newUser = {
    username: 'initialUser',
    name: 'Superuser',
    password: 'hunter2',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const result = await api
    .post('/api/login')
    .send(newUser)

  headers = {
    'Authorization': `Bearer ${result.body.token}`
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are 2 blogs', async () => {
    const res = await api.get('/api/blogs').set(headers)
    assert.strictEqual(res.body.length, 2)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const res = await api.get('/api/blogs').set(headers)
    assert(res.body[0].id)
  })
})

describe('addition of a new blog', () => {
  test('adding a blog fails with the status code 401 Unauthorized if a token is not provided', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'test author',
      url: 'https://test.com',
      likes: 10,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'https://test.com',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set(headers)

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Test blog'))
  })

  test('if the likes property is missing from the request, it will default to 0', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Test author',
      url: 'https://test.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs').set(headers)
    const addedBlog = response.body.find(blog => blog.title === 'Test blog')
    assert.strictEqual(addedBlog.likes, 0)
  })

  test('if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlogNoTitle = {
      author: 'Test author',
      url: 'https://test.com',
    }

    const newBlogNoUrl = {
      title: 'Test blog',
      author: 'Test author',
    }

    await api
      .post('/api/blogs')
      .send(newBlogNoTitle)
      .set(headers)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(newBlogNoUrl)
      .set(headers)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('blog can be deleted', async () => {
    const newBlog = {
      author: 'Test author',
      url: 'https://test.com',
      title: 'Test blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)

    const response = await api.get('/api/blogs').set(headers)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    const addedBlogId = response.body.find(blog => blog.title === newBlog.title).id

    await api
      .delete(`/api/blogs/${addedBlogId}`)
      .set(headers)
      .expect(204)

    const responseAfterDeletion = await(api.get('/api/blogs')).set(headers)
    assert.strictEqual(responseAfterDeletion.body.length, helper.initialBlogs.length)
  })
})

describe('update of a blog', () => {
  test('blog can be updated', async () => {
    const newBlog = {
      author: 'Test author',
      url: 'https://test.com',
      title: 'Test blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)

    const response = await api.get('/api/blogs').set(headers)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    const addedBlogId = response.body.find(blog => blog.title === newBlog.title).id

    const updatedNewBlog = {
      author: 'Test author 2',
      url: 'https://test2.com',
      title: 'Test blog 2',
      likes: 69,
    }

    const responseAfterUpdate = await api.put(`/api/blogs/${addedBlogId}`).set(headers)
      .send(updatedNewBlog)
      .expect(200)

    assert.strictEqual(responseAfterUpdate.body.likes, updatedNewBlog.likes)
  })
})

after(() => {
  mongoose.connection.close()
})